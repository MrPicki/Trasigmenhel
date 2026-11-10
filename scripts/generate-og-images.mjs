#!/usr/bin/env node
/**
 * Draws the picture that shows up when someone shares an episode.
 *
 * Every link to this site has so far previewed as the same thing: the podcast
 * cover, identical for all five episodes. Shared into a Facebook group or a
 * chat, that image says nothing about what the episode is — and the preview
 * image is most of what decides whether anyone clicks. So each episode gets
 * its own, with its title set in the site's own typeface on the site's own
 * black.
 *
 *     npm run og
 *
 * Images land in public/og/<slug>.png and are committed, the same way
 * transcripts are: generated on a Mac, never built in CI, so the deploy stays
 * a plain static build. An episode without an image falls back to the cover,
 * so a missed run is never a broken preview.
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'og');
const FONT = path.join(ROOT, 'assets', 'fonts', 'FamiljenGrotesk-Variable.ttf');

const INK = '#0B0B0D';
const PAPER = '#EDE9E1';
const MUTED = '#A29B8D';
const RULE = '#35353D';

const { slugFor } = await import('./lib/episode-slug.mjs');

/** The declared titles live in the TS config; read them the same way slugs are. */
const declaredTitles = async () => {
  const source = await readFile(path.join(ROOT, 'src', 'config', 'site.ts'), 'utf8');
  const block = source.match(/EPISODE_PAGES:\s*Record<string,\s*EpisodePage>\s*=\s*\{([\s\S]*?)\n\};/);
  if (!block) return {};

  const map = {};
  const entry = /['"]([^'"]+)['"]\s*:\s*\{[\s\S]*?title:\s*\n?\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = entry.exec(block[1])) !== null) map[match[1]] = match[2];
  return map;
};

const el = (type, props) => ({ type, props });

// Satori lays out with flexbox only: an element without an explicit display
// contributes nothing and silently disappears from the card.
const text = (value, style = {}) => el('div', { style: { display: 'flex', ...style }, children: value });

/**
 * Long titles have to shrink or they run off the card. Measured against the
 * real titles rather than guessed: five lines of 92px is the most that fits
 * above the footer rule.
 */
const titleSize = (title) => {
  if (title.length <= 34) return 96;
  if (title.length <= 52) return 80;
  if (title.length <= 72) return 68;
  return 58;
};

const card = (title, meta) =>
  el('div', {
    style: {
      width: 1200,
      height: 630,
      // Without this the padding is added outside the 1200×630 canvas, and
      // everything along the right and bottom edge is cropped away.
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: INK,
      color: PAPER,
      padding: '64px 72px',
      fontFamily: 'Familjen Grotesk',
    },
    children: [
      el('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: 22, color: MUTED, letterSpacing: 4 },
        children: [text('TRASIGMENHEL.SE', {}), text('PODD', {})],
      }),
      text(title, {
        fontSize: titleSize(title),
        fontWeight: 700,
        letterSpacing: -3,
        lineHeight: 1.02,
        maxWidth: 1010,
        display: 'flex',
      }),
      el('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${RULE}`,
          paddingTop: 28,
          fontSize: 24,
          color: MUTED,
          letterSpacing: 2,
        },
        children: [text(meta, {}), text('TRASIG MEN HEL', { color: PAPER })],
      }),
    ],
  });

const fontData = await readFile(FONT);
const feed = JSON.parse(await readFile(path.join(ROOT, 'public', 'episodes.json'), 'utf8'));
const titles = await declaredTitles();
await mkdir(OUT, { recursive: true });

const exists = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

const force = process.argv.includes('--force');
let written = 0;

for (const episode of feed.episodes || []) {
  const slug = slugFor(episode);
  const target = path.join(OUT, `${slug}.png`);

  if (!force && (await exists(target))) {
    console.log(`• ${slug} — har redan bild`);
    continue;
  }

  const title = titles[episode.id] || episode.title;
  const date = new Date(episode.pubDateRaw).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const minutes = episode.durationSeconds ? `${Math.round(episode.durationSeconds / 60)} MIN` : '';
  const meta = [date.toUpperCase(), minutes].filter(Boolean).join('  ·  ');

  const svg = await satori(card(title, meta), {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Familjen Grotesk', data: fontData, weight: 700, style: 'normal' }],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  await writeFile(target, png);
  written += 1;
  console.log(`✓ ${slug} — ${Math.round(png.length / 1024)} kB`);
}

console.log(`\nKlart. ${written} nya delningsbilder i public/og/.`);
