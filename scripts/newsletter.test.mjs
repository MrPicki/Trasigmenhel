import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildNewEpisodeEmailHtml,
  buildWelcomeEmailHtml,
  escapeHtml,
  safeHttpUrl,
  visibleEpisodes,
} from './newsletter-template.mjs';
import { parseLatestEpisode } from './notify-new-episode.mjs';

const episodes = [
  {
    title: 'Äldre & viktigt',
    description: 'En äldre beskrivning.',
    publishedAt: '2026-08-01T10:00:00.000Z',
    durationSeconds: 1800,
    image: 'https://example.com/old.jpg',
    link: 'https://example.com/old',
  },
  {
    title: 'Test avsnitt',
    description: 'Ska inte visas.',
    publishedAt: '2026-09-02T10:00:00.000Z',
    link: 'https://example.com/test',
  },
  {
    title: 'Nytt <avsnitt>',
    description: 'En ny & trygg beskrivning.',
    publishedAt: '2026-09-01T10:00:00.000Z',
    durationSeconds: 2928,
    image: 'javascript:alert(1)',
    link: 'javascript:alert(1)',
  },
];

test('escapeHtml kodar text som hamnar i e-postens HTML', () => {
  assert.equal(escapeHtml(`A&B <tag> "x" 'y'`), 'A&amp;B &lt;tag&gt; &quot;x&quot; &#39;y&#39;');
});

test('safeHttpUrl tillåter bara http och https', () => {
  assert.equal(safeHttpUrl('javascript:alert(1)', 'https://trasigmenhel.se'), 'https://trasigmenhel.se');
  assert.equal(safeHttpUrl('https://example.com/a'), 'https://example.com/a');
});

test('visibleEpisodes sorterar, begränsar och döljer testavsnitt', () => {
  assert.deepEqual(
    visibleEpisodes(episodes, 3).map((episode) => episode.title),
    ['Nytt <avsnitt>', 'Äldre & viktigt']
  );
});

test('välkomstbrevet innehåller de senaste riktiga avsnitten och avregistrering', () => {
  const html = buildWelcomeEmailHtml(episodes);
  assert.match(html, /Nytt &lt;avsnitt&gt;/);
  assert.match(html, /Äldre &amp; viktigt/);
  assert.doesNotMatch(html, /Test avsnitt/);
  assert.doesNotMatch(html, /javascript:/);
  assert.match(html, /\{\{ unsubscribe \}\}/);
});

test('utskicket för nytt avsnitt återanvänder den säkra e-postmallen', () => {
  const html = buildNewEpisodeEmailHtml(episodes[2]);
  assert.match(html, /Nytt &lt;avsnitt&gt;/);
  assert.doesNotMatch(html, /javascript:/);
});

test('RSS-tolkningen väljer senaste riktiga avsnitt och bevarar mellanrum', () => {
  const rss = `
    <rss><channel>
      <item>
        <title><![CDATA[Test avsnitt]]></title>
        <description><![CDATA[<p>Ska döljas.</p>]]></description>
        <link>https://example.com/test</link>
        <guid>test-1</guid>
        <pubDate>Wed, 02 Sep 2026 10:00:00 GMT</pubDate>
      </item>
      <item>
        <title><![CDATA[Riktigt &amp; nytt]]></title>
        <description><![CDATA[<p>Första meningen.</p><p>Andra meningen.</p>]]></description>
        <link>https://example.com/episode</link>
        <guid>episode-1</guid>
        <pubDate>Tue, 01 Sep 2026 10:00:00 GMT</pubDate>
        <itunes:duration>48:48</itunes:duration>
      </item>
    </channel></rss>`;

  const episode = parseLatestEpisode(rss);
  assert.equal(episode.title, 'Riktigt & nytt');
  assert.equal(episode.description, 'Första meningen. Andra meningen.');
  assert.equal(episode.durationSeconds, 2928);
});
