import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { getLookingBack, LOOKING_BACK_BYLINE } from '@/lib/content/looking-back';
import { fitHeadline, socialImageSize } from '@/lib/social-card';

export const runtime = 'nodejs';
export const size = socialImageSize;
export const contentType = 'image/png';
export const alt = 'The Brief · Looking Back keepsake';

export function generateStaticParams() {
  return getLookingBack().map(piece => ({ slug: piece.slug }));
}

const PAPER = '#f3ecdc', INK = '#2a2620', RULE = '#2a2620', MUTED = '#5f574b';

/** The keepsake design as a 1200 × 630 PNG for X, link previews and the newsletter. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const piece = getLookingBack().find(item => item.slug === slug);
  if (!piece) return new Response(null, { status: 404 });
  const [serif, sans] = await Promise.all([
    readFile(path.join(process.cwd(), 'assets/social/SourceSerif4Display-Bold.ttf')),
    readFile(path.join(process.cwd(), 'node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf')),
  ]);
  const headline = fitHeadline(piece.title, 1000, 200, 80);
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#1f1d1a', padding: 28 }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: PAPER, color: INK, padding: '34px 72px 38px', fontFamily: 'Geist' }}>
        <div style={{ display: 'flex', height: 6, background: RULE }} />
        <div style={{ display: 'flex', height: 1, background: RULE, marginTop: 4 }} />
        <div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'Source Serif', fontSize: 34, letterSpacing: '6px', marginTop: 14 }}>THE BRIEF · LOOKING BACK</div>
        <div style={{ display: 'flex', height: 1, background: RULE, marginTop: 14 }} />
        <div style={{ display: 'flex', justifyContent: 'center', fontSize: 20, letterSpacing: '1px', color: MUTED, marginTop: 14 }}>{piece.dateline}</div>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {headline.lines.map((line, index) => <div key={index} style={{ display: 'flex', whiteSpace: 'nowrap', fontFamily: 'Source Serif', fontSize: headline.fontSize, lineHeight: 1.08, height: headline.lineHeight, letterSpacing: '-1px' }}>{line}</div>)}
          {piece.scoreline && <div style={{ display: 'flex', fontFamily: 'Source Serif', fontSize: piece.scoreline.length > 40 ? 24 : 30, letterSpacing: piece.scoreline.length > 40 ? '1.5px' : '3px', marginTop: 18 }}>{piece.scoreline.toUpperCase()}</div>}
        </div>
        <div style={{ display: 'flex', height: 1, background: RULE }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: MUTED, marginTop: 12 }}>
          <div style={{ display: 'flex' }}>theliverpoolbrief.com/looking-back</div>
          <div style={{ display: 'flex' }}>By {LOOKING_BACK_BYLINE}</div>
        </div>
      </div>
    </div>,
    { ...socialImageSize, fonts: [
      { name: 'Source Serif', data: serif, weight: 700, style: 'normal' },
      { name: 'Geist', data: sans, weight: 400, style: 'normal' },
    ] },
  );
}
