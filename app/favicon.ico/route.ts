import Icon from '../icon';

// Serve actual ICO bytes: static hosts may discard redirect headers on .ico paths.
export async function GET() {
  const png = Buffer.from(await Icon().arrayBuffer());
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(1, 4); // One image
  header[6] = 192;
  header[7] = 192;
  header.writeUInt16LE(1, 10); // Colour planes
  header.writeUInt16LE(32, 12); // Bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // PNG payload offset
  return new Response(Buffer.concat([header, png]), { headers: { 'Content-Type': 'image/x-icon' } });
}
