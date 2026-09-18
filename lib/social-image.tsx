import { ImageResponse } from 'next/og';

export const socialImageSize = { width: 1200, height: 630 };

/** Text-led cards keep each story identifiable without unlicensed photography. */
export function socialImage(title: string, section: string) {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#f8f5ef', color: '#181818', padding: '48px 64px', borderTop: '16px solid #b50920' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #d8d1c7', paddingBottom: 26 }}>
        <div style={{ fontSize: 32, fontWeight: 700 }}>THE LIVERPOOL BRIEF</div>
        <div style={{ fontSize: 23, color: '#b50920', textTransform: 'uppercase' }}>{section}</div>
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', fontSize: title.length > 110 ? 48 : title.length > 75 ? 56 : 66, fontWeight: 700, lineHeight: 1.12, letterSpacing: '-1.5px' }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #d8d1c7', paddingTop: 22, fontSize: 22, color: '#605c56' }}>
        <div>Independent Liverpool writing</div><div>theliverpoolbrief.com</div>
      </div>
    </div>,
    socialImageSize,
  );
}
