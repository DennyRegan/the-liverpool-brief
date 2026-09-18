import { ImageResponse } from 'next/og';
export const size = { width: 192, height: 192 };
export const contentType = 'image/png';
export default function Icon() {
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: '#b50920', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 76, fontWeight: 700, letterSpacing: '-5px' }}>LB</div>, size);
}
