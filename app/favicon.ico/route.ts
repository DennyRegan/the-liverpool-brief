// Keep older browser and messaging-app requests on our branded icon.
export function GET() {
  return new Response('Redirecting to the site icon.', { status: 307, headers: { Location: '/icon' } });
}
