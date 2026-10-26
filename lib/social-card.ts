import metrics from '../assets/social/serif-metrics.json' with { type: 'json' };

export const socialImageSize = { width: 1200, height: 630 };
export const SOCIAL_IMAGE_VERSION = 'editorial-2';

export function socialSection(article: { category: string; tags?: readonly string[] }) {
  return article.category === 'Opinion' && article.tags?.includes('regan-on-football')
    ? 'Football Observed' : article.category;
}

// Advance widths come from the bundled headline font. Ignore negative kerning
// and leave a small safety margin; never truncate or use a line clamp.
export function headlineWidth(text: string, fontSize: number) {
  const widths = metrics.widths as Record<string, number>;
  return Array.from(text).reduce((total, char) => total + (widths[String(char.codePointAt(0))] ?? metrics.unitsPerEm), 0)
    / metrics.unitsPerEm * fontSize * 1.04;
}

export function fitHeadline(title: string, width: number, height: number, maximum = 136) {
  const words = title.trim().split(/\s+/);
  for (let fontSize = maximum; fontSize >= 1; fontSize--) {
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      if (line && headlineWidth(`${line} ${word}`, fontSize) > width) {
        lines.push(line); line = '';
      }
      // Even an unbroken long word/URL must fit without escaping the text panel.
      for (const char of Array.from((line ? ' ' : '') + word)) {
        if (line && headlineWidth(line + char, fontSize) > width) {
          lines.push(line); line = '';
        }
        line += char;
      }
    }
    if (line) lines.push(line);
    if (lines.length * fontSize * 1.08 <= height) return { fontSize, lines, lineHeight: fontSize * 1.08 };
  }
  throw new Error('Headline exceeds social-card capacity');
}
