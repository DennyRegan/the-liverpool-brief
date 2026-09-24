from pathlib import Path
import json
import argparse
import pandas as pd
import numpy as np
import statsmodels.formula.api as smf

parser = argparse.ArgumentParser(description="Reproduce the Liverpool international-break audit from archived raw match records.")
parser.add_argument("--raw", type=Path, required=True, help="Directory containing pl_2015.csv ... pl_2025.csv and ESPN calendar JSON files")
parser.add_argument("--out", type=Path, required=True, help="Directory for the independently calculated audit outputs")
args = parser.parse_args()
RAW = args.raw
OUT = args.out
OUT.mkdir(parents=True, exist_ok=True)
frames=[]
for year in range(2015,2026):
    d=pd.read_csv(RAW/f'pl_{year}.csv')
    d['date']=pd.to_datetime(d.Date,dayfirst=True)
    assert len(d)==380 and d[['HomeTeam','AwayTeam','FTHG','FTAG']].notna().all().all(), year
    d['season']=year
    frames.append(d[['season','date','HomeTeam','AwayTeam','FTHG','FTAG']])
games=pd.concat(frames,ignore_index=True).sort_values(['season','date','HomeTeam']).reset_index(drop=True)
games['match_id']=np.arange(len(games))
# Independent parse of the archived raw ESPN responses, not earlier derived analysis.
events={}
for y in range(2015,2027):
    for e in json.loads((RAW/f'espn_cal_{y}_eng.1.json').read_text())['events']:
        s=e['season']['year']
        if not 2015<=s<=2025: continue
        c=e['competitions'][0]
        if not c['status']['type']['completed']: continue
        competitors={x['homeAway']:x for x in c['competitors']}
        h,a=competitors['home'],competitors['away']
        t=pd.Timestamp(c['date']).tz_convert('Europe/London')
        events[e['id']]={'season':s,'date':t.tz_localize(None).normalize(),'home':h['team']['displayName'],'away':a['team']['displayName'],'hg':int(h['score']),'ag':int(a['score']),'kickoff':t.isoformat()}
espn=pd.DataFrame(events.values())
name_map={'AFC Bournemouth':'Bournemouth','Brighton & Hove Albion':'Brighton','Huddersfield Town':'Huddersfield','Leeds United':'Leeds','Leicester City':'Leicester','Luton Town':'Luton','Manchester City':'Man City','Manchester United':'Man United','Newcastle United':'Newcastle','Norwich City':'Norwich','Nottingham Forest':"Nott'm Forest",'Sheffield United':'Sheffield United','Stoke City':'Stoke','Swansea City':'Swansea','Tottenham Hotspur':'Tottenham','West Bromwich Albion':'West Brom','West Ham United':'West Ham','Wolverhampton Wanderers':'Wolves','Cardiff City':'Cardiff','Hull City':'Hull','Ipswich Town':'Ipswich','Queens Park Rangers':'QPR'}
espn['HomeTeam']=espn.home.replace(name_map)
espn['AwayTeam']=espn.away.replace(name_map)
merged=games.merge(espn,on=['season','date','HomeTeam','AwayTeam'],how='outer',indicator=True,validate='one_to_one')
print('Cross-source result checks:',merged['_merge'].value_counts().to_dict())
print('Score mismatches:',len(merged[(merged.FTHG!=merged.hg)|(merged.FTAG!=merged.ag)]))
assert len(merged)==4180 and (merged['_merge']=='both').all()
assert (merged.FTHG==merged.hg).all() and (merged.FTAG==merged.ag).all()
games=merged.drop(columns=['_merge'])
breaks=[]
for s,g in games.groupby('season'):
    dates=sorted(g.date.unique())
    for before,after in zip(dates,dates[1:]):
        gap=(after-before).days
        if gap>=12 and before.month in [8,9,10,11,3]:
            reason='international'
            if gap>40: reason='covid/worldcup'
            elif str(after.date())=='2022-09-16': reason='Queen postponements'
            breaks.append({'season':s,'before':before,'restart':after,'gap':gap,'reason':reason})
b=pd.DataFrame(breaks)
print('Breaks:\n',b.to_string(index=False))
b.to_csv(OUT/'identified-breaks.csv',index=False)
b=b[b.reason=='international'].copy()
rows=[]
for x in games.itertuples():
    for home,club,opponent,gf,ga in [(1,x.HomeTeam,x.AwayTeam,x.FTHG,x.FTAG),(0,x.AwayTeam,x.HomeTeam,x.FTAG,x.FTHG)]:
        rows.append({'season':x.season,'date':x.date,'club':club,'opponent':opponent,'home':home,'gf':gf,'ga':ga,'points':3 if gf>ga else 1 if gf==ga else 0,'match_id':x.match_id,'kickoff':x.kickoff,'post':0,'break_id':''})
t=pd.DataFrame(rows)
for i,x in b.iterrows():
    w=t[(t.season==x.season)&(t.date>=x.restart)&(t.date<x.restart+pd.Timedelta(days=7))]
    first=w.sort_values('date').groupby('club').head(1)
    assert len(first)==20,(x, len(first))
    t.loc[first.index,'post']=1
    t.loc[first.index,'break_id']=str(x.restart.date())
t['club_season']=t.club+'_'+t.season.astype(str)
tot=t.groupby(['season','club']).points.sum()
t['opponent_total']=[tot.loc[(s,o)] for s,o in zip(t.season,t.opponent)]
t['opponent_points_in_match']=np.select([t.points==0,t.points==1],[3,1],default=0)
t['opp_ppg']=(t.opponent_total-t.opponent_points_in_match)/37
# early uses local UK scheduled start, not UTC.
t['early']=[pd.Timestamp(k).hour<13 for k in t.kickoff]
t['klopp']=(t.date>=pd.Timestamp('2015-10-08'))&(t.date<=pd.Timestamp('2024-05-19'))
t['big6']=t.club.isin(['Liverpool','Arsenal','Chelsea','Man City','Man United','Tottenham'])
t['opp_big6']=t.opponent.isin(['Liverpool','Arsenal','Chelsea','Man City','Man United','Tottenham'])
def describe(df):
    return {'n':len(df),'w':int((df.points==3).sum()),'d':int((df.points==1).sum()),'l':int((df.points==0).sum()),'ppg':float(df.points.mean()),'opp_ppg':float(df.opp_ppg.mean()),'away':int((df.home==0).sum())}
print('All post:',describe(t[t.post==1]),'unique fixtures',t[t.post==1].match_id.nunique())
liv=t[t.club=='Liverpool'].copy()
print('Liverpool post',describe(liv[liv.post==1]),'ordinary',describe(liv[liv.post==0]))
print('Season totals:',liv.groupby('season').points.sum().to_dict())
print('Champions:',t.groupby(['season','club']).points.sum().reset_index().sort_values('points',ascending=False).groupby('season').head(1).sort_values('season').to_string(index=False))
kl=liv[liv.klopp].copy()
for label,df in [('Klopp post',kl[kl.post==1]),('Klopp ordinary',kl[kl.post==0]),('early post',kl[(kl.post==1)&kl.early]),('later post',kl[(kl.post==1)&~kl.early]),('Slot post',liv[(liv.season>=2024)&(liv.post==1)])]:
    print(label,describe(df))
print('Early share ordinary Klopp:',kl[kl.post==0].early.mean())
print('Liverpool post per season:\n',liv[liv.post==1].groupby('season').points.agg(['count','sum','mean']).to_string())
print('Liverpool post list:\n',liv[liv.post==1][['season','date','opponent','home','gf','ga','points','kickoff','early']].to_string(index=False))
liv[liv.post==1].to_csv(OUT/'liverpool-first-games.csv',index=False)
t.to_csv(OUT/'all-club-matches.csv',index=False)
models=[]
def fit(label,frame,formula,term='post'):
    for cov in ['nonrobust','HC1','HC3','cluster']:
        kw={'cov_type':cov}
        if cov=='cluster':kw.update(cov_kwds={'groups':frame.club_season},use_t=True)
        m=smf.ols(formula,frame).fit(**kw)
        ci=m.conf_int().loc[term]
        row={'label':label,'cov':cov,'n':int(m.nobs),'coef':float(m.params[term]),'low':float(ci.iloc[0]),'high':float(ci.iloc[1]),'p':float(m.pvalues[term])}
        models.append(row); print(row)
fit('Liverpool',liv,'points ~ post + home + opp_ppg + C(season)')
kl['early_post']=((kl.post==1)&kl.early).astype(int)
kl['late_post']=((kl.post==1)&~kl.early).astype(int)
fit('Klopp early v ordinary',kl,'points ~ early_post + late_post + home + opp_ppg + C(season)','early_post')
fit('Klopp early v late',kl[kl.post==1],'points ~ early_post + home + opp_ppg + C(season)','early_post')
big=t[t.big6 & ~t.opp_big6].copy()
print('Big6 v rest post:',describe(big[big.post==1]),'ordinary',describe(big[big.post==0]))
fit('Big6 v rest',big,'points ~ post + home + opp_ppg + C(club_season)')
pd.DataFrame(models).to_csv(OUT/'model-results.csv',index=False)
