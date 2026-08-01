import { getBrief } from '@/lib/content/briefs';
import { SiteHeader } from '@/app/components/SiteHeader';

export default function Home() {
  const brief = getBrief();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="home" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date(brief.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {brief.editorsNote && (
          <div className="bg-red-50 border-l-4 border-accent p-4 mb-8">
            <p className="text-sm italic text-gray-700">{brief.editorsNote}</p>
          </div>
        )}

        {brief.stories && brief.stories.length > 0 && (
          <div className="space-y-8">
            {brief.stories.map((story: any, index: number) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{story.headline}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{story.summary}</p>
                {story.sources && story.sources.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-gray-700 mb-2">Source:</p>
                    <ul className="space-y-1">
                      {story.sources.map((source: any, idx: number) => (
                        <li key={idx}>
                          {source.name} ({source.platform})
                          {source.url && (
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-dark hover:underline ml-2">→</a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}