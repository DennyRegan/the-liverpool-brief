import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
const root = process.cwd();
function files(dir) { return fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes:true }).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : e.isFile() ? [path.join(dir,e.name)] : []) : []; }
const output = path.join(root,'.next');
assert.ok(fs.existsSync(path.join(output,'BUILD_ID')), 'Build normal production output first');
const traces = files(output).filter(f => f.endsWith('.nft.json'));
const forbidden = /^(prototype\/|docs\/editorial\/|\.next-history-prototype\/)/;
for (const trace of traces) for (const entry of JSON.parse(fs.readFileSync(trace,'utf8')).files) {
 const relative = path.relative(root,path.resolve(path.dirname(trace),entry));
 assert.ok(!forbidden.test(relative), `Private file included in deployment trace: ${relative}`);
}
const required = ['content/history/liverpool/seasons/1987-88.json','content/history/liverpool/atlases/1987-88.json','content/archive/liverpool/liverpool-nottingham-forest-1988-five-at-anfield.md','content/archive/liverpool/liverpools-manager-scored-after-21-seconds-at-goodison.md','content/history/liverpool/entities.json','content/history/liverpool/event-verifications.json','content/history/liverpool/featured-matches.json'];
for (const route of ['history/page','history/matches/page','history/seasons/page','history/seasons/[season]/page','history/people/page','history/explore/page','search/page']) {
 const trace = path.join(output,'server/app',`${route}.js.nft.json`);
 const traced = JSON.parse(fs.readFileSync(trace,'utf8')).files.map(f => path.relative(root,path.resolve(path.dirname(trace),f)));
 for (const requiredFile of required) assert.ok(traced.includes(requiredFile), `${route} deployment missing ${requiredFile}`);
}
const editorialRoot = process.env.HISTORY_EDITORIAL_ROOT || root;
const manifestPath = path.join(editorialRoot,'prototype/match-review/manifest.json');
const privateEntries = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath,'utf8')).reports.filter(r => r.included && r.status !== 'published') : [];
// Scan generated server/client artifacts and public files, excluding build cache and dependencies.
const emitted = [...files(path.join(output,'server')), ...files(path.join(output,'static')), ...files(path.join(root,'public'))].filter(f => !f.endsWith('.nft.json'));
const needles = privateEntries.map(r => {
 const body = matter(fs.readFileSync(path.join(editorialRoot,r.localPath),'utf8')).content.trim();
 const paragraph = body.split(/\n\s*\n/).find(p => p.length > 100 && !p.startsWith('#'));
 assert.ok(paragraph, `No narrative sentinel for ${r.slug}`);
 return { slug:r.slug, text:paragraph.slice(0,100), title:r.title };
});
for (const file of emitted) {
 const text = fs.readFileSync(file).toString('utf8');
 for (const item of needles) {
  assert.ok(!text.includes(item.text) && !text.includes(JSON.stringify(item.text).slice(1,-1)), `Private narrative emitted in ${path.relative(root,file)}: ${item.slug}`);
  if (/\.(html|rsc|txt|xml)$/.test(file) || file.includes(`${path.sep}static${path.sep}`)) assert.ok(!text.includes(item.title), `Private title in browser output: ${item.slug}`);
 }
}
console.log(`PASS: ${traces.length} deployment traces include required approved data and exclude editorial files; ${emitted.length} emitted/public files scanned against ${privateEntries.length} unapproved report sentinels.${privateEntries.length ? '' : ' Local inventory absent: no private-text sentinel scan; trace checks still enforced.'}`);
