import { permanentRedirect } from 'next/navigation';
// One canonical History destination; keep old bookmarks useful.
export default function ThisWeekRedirect() { permanentRedirect('/history/on-this-day'); }
