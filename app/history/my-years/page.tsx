import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { TimelineSections } from "@/app/components/history/V3Exploration";
import { getV3View } from "@/lib/content/history-v3-view";
import { selectLiverpoolYears } from "@/lib/content/history-v3";
export const metadata = {
  title: "Your Liverpool Years | The Liverpool Brief",
  alternates: { canonical: "/history/my-years" },
};
export default async function MyYearsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[] }>;
}) {
  const { from } = await searchParams;
  const { timeline } = getV3View();
  const first = timeline[0]?.year,
    last = timeline.at(-1)?.year;
  const years =
    first && last
      ? Array.from({ length: last - first + 1 }, (_, i) => first + i)
      : [];
  const valid =
    typeof from === "string" &&
    /^\d{4}$/.test(from) &&
    years.includes(Number(from));
  const selected = valid ? Number(from) : undefined;
  return (
    <>
      <SiteHeader active="history" />
      <main id="main-content" className="site-width hx-page v3-page">
        <HistoryNav active="my-years" />
        <header className="hx-intro">
          <p className="eyebrow">A starting point, chosen by you</p>
          <h1>Your Liverpool Years</h1>
          <p className="hx-standfirst">
            When did Liverpool become part of your life?
          </p>
          <p>
            Choose a year you remember—or one you want to explore. No personal
            details needed.
          </p>
        </header>
        <form action="/history/my-years" method="get" className="v3-filters">
          <div>
            <label htmlFor="starting-year">Starting year</label>
            <select
              id="starting-year"
              name="from"
              defaultValue={selected ?? ""}
              required
            >
              <option value="" disabled>
                Choose a year
              </option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <button type="submit">Explore my years</button>
          <Link href="/history/timeline">Just let me explore</Link>
        </form>
        {from && !valid && (
          <p role="status">
            Choose a starting year between {first} and {last}.
          </p>
        )}
        {selected !== undefined && (
          <>
            <h2 className="v3-years-title">From {selected} onwards</h2>
            <p>
              Seasons beginning in {selected} or later, with the available
              writing and dated events. Earlier Season records stay outside this
              sequence. Some years have more writing than others.
            </p>
            <TimelineSections
              sections={selectLiverpoolYears(timeline, selected)}
            />
          </>
        )}
      </main>
    </>
  );
}
