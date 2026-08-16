import { getBrief } from '@/lib/content/briefs';
import { SiteHeader } from '@/app/components/SiteHeader';
import { formatLastUpdated } from '@/lib/format';

type Story = ReturnType<typeof getBrief>['stories'][number];

export default function Home() {
  const brief = getBrief();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="home" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-gray-50 rounded-lg px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Today&rsquo;s brief</p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {formatLastUpdated(brief.lastUpdated)}
          </p>

          {brief.editorsNote && (
            <div className="bg-white border-l-4 border-accent p-4 mt-6">
              <p className="text-sm italic text-gray-700">{brief.editorsNote}</p>
            </div>
          )}

          {brief.stories && brief.stories.length > 0 && (
            <div className="mt-6">
              {brief.stories.map((story: Story, index: number) => (
                <div
                  key={index}
                  className={index > 0 ? 'pt-6 mt-6 border-t border-gray-200' : ''}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">
                    {story.category}
                  </p>
                  <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">{story.headline}</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">{story.summary}</p>
                  {story.sources && story.sources.length > 0 && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">Sources: </span>
                      {story.sources.map((source, idx) => (
                        <span key={idx}>
                          {idx > 0 && ' · '}
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent hover:underline"
                          >
                            {source.name}
                          </a>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
