import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getEditionContents, remarkEditionHeadings } from '../lib/edition-contents.ts';

const render = body => renderToStaticMarkup(React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkGfm, remarkEditionHeadings],
}, body));

test('contents preserve formatted headings and point to the actual rendered targets', () => {
  const body = 'Opening argument.\n\n## **Rio** & [Wirtz](/articles)\n\nText.\n\nKane or `Yamal`?\n---\n\nText.';
  const sections = getEditionContents(body, 'Lead story');
  assert.deepEqual(sections, [
    { id: 'edition-opening', title: 'Lead story' },
    { id: 'edition-rio-wirtz', title: 'Rio & Wirtz' },
    { id: 'edition-kane-or-yamal', title: 'Kane or Yamal?' },
  ]);
  const html = render(body);
  for (const section of sections.slice(1)) assert.ok(html.includes(`id="${section.id}"`));
  assert.match(html, /<strong>Rio<\/strong>/);
  assert.match(html, /tabindex="-1"/);
});

test('duplicate, reserved, punctuation and accented headings produce unique stable targets', () => {
  const body = ['Opening', 'Opening', 'Opening 2', 'Salah', 'Salah', 'Salah 2', 'Salah', '⚽', '⚽', 'Víctor Muñoz'].map(title => `## ${title}\n\nText.`).join('\n\n');
  const sections = getEditionContents(body, 'Edition');
  assert.equal(new Set(sections.map(s => s.id)).size, sections.length);
  assert.equal(sections[0].id, 'edition-opening-2');
  assert.equal(sections.at(-1).id, 'edition-victor-munoz');
  for (const section of sections) assert.ok(render(body).includes(`id="${section.id}"`));
  assert.deepEqual(getEditionContents(body, 'Edition'), sections);
});

test('single subjects, quoted headings, code fences and subheadings do not create contents', () => {
  for (const body of ['', 'A single story.', '## One subject\n\nText.', '```md\n## Example\n```', '> ## Quoted heading', '### Subheading']) {
    assert.deepEqual(getEditionContents(body, 'Edition'), []);
  }
  assert.deepEqual(getEditionContents('Intro\n\n## Another subject', 'Lead'), [
    { id: 'edition-opening', title: 'Lead' }, { id: 'edition-another-subject', title: 'Another subject' },
  ]);
});
