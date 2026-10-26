# Social headline font

`SourceSerif4Display-Bold.ttf` is Adobe's unmodified Source Serif 4 Display Bold, obtained from:

https://github.com/adobe-fonts/source-serif/blob/release/TTF/SourceSerif4Display-Bold.ttf

The accompanying `OFL.txt` is the upstream SIL Open Font License. The font is bundled locally so image rendering never depends on a font-host request. It is used only in generated social cards; the website's fonts are unchanged.

`serif-metrics.json` contains the font's units per em and Unicode advance widths, used for deterministic headline wrapping. It was generated using the Fontkit decoder already bundled with the pinned Next.js version (development only). If the font binary changes, regenerate the metrics:

```js
const fs = require('node:fs');
const decode = require('next/dist/compiled/@next/font/dist/fontkit').default;
const font = decode(fs.readFileSync('assets/social/SourceSerif4Display-Bold.ttf'));
const widths = {};
for (const cp of font.characterSet) widths[cp] = font.glyphForCodePoint(cp).advanceWidth;
fs.writeFileSync('assets/social/serif-metrics.json', JSON.stringify({ unitsPerEm: font.unitsPerEm, widths }) + '\n');
```
