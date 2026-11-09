import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import metrics from '../assets/looking-back/headline-metrics.json' with { type: 'json' };
import { socialImageSize } from './social-card.ts';

// Share image for every Looking Back page (Match Revisited, On This Day,
// biographies, series parts), drawn from the piece's own frontmatter. It mirrors
// the page: cream newsprint with a faint dot grain, red top rule, spaced red
// masthead over a double black rule, Old Standard TT headline, IM Fell small caps.
// Fonts are the same families the site loads (app/components/history-fonts.ts),
// bundled locally in assets/looking-back so rendering never needs a font host.
const PAPER = '#f4ecda', INK = '#1a1814', RED = '#c8102e', MUTED = '#5f574b';

export const lookingBackImageSize = socialImageSize;

type Card = { kicker: (string | undefined | null)[]; headline: string; subtitle?: string };

function width(text: string, fontSize: number) {
  const widths = metrics.widths as Record<string, number>;
  return Array.from(text).reduce((sum, char) => sum + (widths[String(char.codePointAt(0))] ?? metrics.unitsPerEm * 0.6), 0) / metrics.unitsPerEm * fontSize * 1.05;
}

/** Largest size at which the headline wraps inside the box. Never truncates. */
export function fitLookingBackHeadline(text: string, boxWidth: number, boxHeight: number, maximum = 104) {
  const words = text.trim().split(/\s+/);
  for (let fontSize = maximum; fontSize >= 20; fontSize--) {
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      if (line && width(`${line} ${word}`, fontSize) > boxWidth) { lines.push(line); line = word; } else line = line ? `${line} ${word}` : word;
    }
    if (line) lines.push(line);
    if (lines.length * fontSize * 1.1 <= boxHeight && lines.every(l => width(l, fontSize) <= boxWidth)) return { fontSize, lines, lineHeight: fontSize * 1.1 };
  }
  return { fontSize: 20, lines: [text], lineHeight: 22 };
}

const rule = (height: number, color = INK, marginTop = 0) => <div style={{ display: 'flex', height, background: color, marginTop }} />;

export async function lookingBackImage({ kicker, headline, subtitle }: Card) {
  const dir = path.join(process.cwd(), 'assets/looking-back');
  const [bold, caps] = await Promise.all([readFile(path.join(dir, 'OldStandardTT-Bold.ttf')), readFile(path.join(dir, 'IMFellEnglishSC-Regular.ttf'))]);
  const section = kicker.filter(Boolean).join(' · ');
  const fit = fitLookingBackHeadline(headline, 980, subtitle ? 250 : 290);
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: PAPER, backgroundImage: 'radial-gradient(rgba(60,45,20,0.10) 1px, transparent 1.4px)', backgroundSize: '7px 7px', fontFamily: 'Fell SC', color: INK }}>
      {rule(8, RED)}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '26px 80px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', color: RED, fontSize: 26, letterSpacing: '9px' }}>THE LIVERPOOL BRIEF</div>
        {rule(3, INK, 14)}{rule(1, INK, 4)}
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', color: RED, fontSize: 28, letterSpacing: '3px', marginTop: 22 }}>{section}</div>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {fit.lines.map((line, i) => <div key={i} style={{ display: 'flex', whiteSpace: 'nowrap', fontFamily: 'Old Standard', fontWeight: 700, fontSize: fit.fontSize, lineHeight: 1.1, height: fit.lineHeight }}>{line}</div>)}
          {subtitle && <div style={{ display: 'flex', textAlign: 'center', fontSize: subtitle.length > 44 ? 26 : 32, letterSpacing: '3px', color: INK, marginTop: 20 }}>{subtitle}</div>}
        </div>
        {rule(1, INK)}{rule(3, INK, 4)}
        <div style={{ display: 'flex', justifyContent: 'center', fontSize: 22, letterSpacing: '3px', color: MUTED, marginTop: 12 }}>theliverpoolbrief.com</div>
      </div>
    </div>,
    { ...socialImageSize, fonts: [
      { name: 'Old Standard', data: bold, weight: 700, style: 'normal' },
      { name: 'Fell SC', data: caps, weight: 400, style: 'normal' },
    ] },
  );
}
