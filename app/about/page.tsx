import { SiteHeader } from "@/app/components/SiteHeader";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="about" />
      <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What this is</h2>
          <p className="text-gray-700 leading-relaxed">
            The Liverpool Brief exists to do one thing well: open the app, understand
            today's important Liverpool news in 30–45 seconds, close the app. No feed to
            scroll, no noise to filter — just the things that actually matter about the
            club today, written plainly and attributed clearly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who it's for</h2>
          <p className="text-gray-700 leading-relaxed">
            This is for supporters who care about Liverpool but don't have time to follow
            twelve accounts, three forums, and a live blog to work out what's actually
            true. If you want to stay properly informed without wading through hot takes
            and speculation to find it, this is built for you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What makes it different</h2>
          <p className="text-gray-700 leading-relaxed">
            Football news online is fast, fragmented, and often sensationalised —
            optimised for clicks and engagement rather than for helping you understand
            what happened. The Liverpool Brief takes the opposite approach: one daily
            brief, written calmly, that tells you what's true and where it came from.
            Nothing here is written to provoke a reaction — it's written to inform one.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our standards</h2>
          <ul className="space-y-4">
            <li>
              <p className="font-semibold text-gray-900">Accuracy before speed</p>
              <p className="text-gray-700 leading-relaxed">
                We'd rather be right a little later than first and wrong. Nothing goes
                into the brief until we're confident it's accurate.
              </p>
            </li>
            <li>
              <p className="font-semibold text-gray-900">Clear source attribution</p>
              <p className="text-gray-700 leading-relaxed">
                Every story links back to where it came from, so you can always see the
                origin and judge it for yourself rather than taking our word for it.
              </p>
            </li>
            <li>
              <p className="font-semibold text-gray-900">A calm, plain-English tone</p>
              <p className="text-gray-700 leading-relaxed">
                We explain, we don't sensationalise. No breathless headlines, no
                manufactured drama — just a clear account of what's happening at the
                club.
              </p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
