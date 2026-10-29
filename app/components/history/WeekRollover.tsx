'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Refresh only the default current-week view. No writing or source fetching takes place. */
export function WeekRollover({ monday }: { monday: string }) {
  const router = useRouter();
  useEffect(() => {
    const check = () => {
      const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      const date = new Date(`${iso}T12:00:00Z`);
      date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
      if (date.toISOString().slice(0, 10) !== monday) router.refresh();
    };
    const onVisible = () => { if (document.visibilityState === 'visible') check(); };
    const timer = setInterval(check, 60_000);
    document.addEventListener('visibilitychange', onVisible);
    check();
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [monday, router]);
  return null;
}
