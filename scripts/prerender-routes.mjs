#!/usr/bin/env node
/**
 * GitHub Pages serves a real file or nothing. Without this, trasigmenhel.se/lankar
 * is answered by 404.html and a redirect — which works for people, but social
 * crawlers do not run JavaScript and will not preview a 404. So after the build
 * we write a real 200-status page for each extra route, carrying that route's own
 * title and Open Graph tags. The SPA still takes over on load.
 *
 * Runs automatically after `npm run build` (npm's postbuild hook), so
 * `npm run deploy` picks it up with no extra step.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const SITE = 'https://trasigmenhel.se';

const ROUTES = [
  {
    dir: 'lankar',
    title: 'Länkar | Trasig men Hel',
    description:
      'Alla kanaler för podden Trasig men Hel på ett ställe - Spotify, Apple Podcasts, Instagram, TikTok, YouTube och Facebook.',
  },
];

const replaceMeta = (html, attr, name, value) => {
  const pattern = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`);
  return pattern.test(html) ? html.replace(pattern, `$1${value}$2`) : html;
};

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

for (const route of ROUTES) {
  const url = `${SITE}/${route.dir}`;
  const title = escape(route.title);
  const description = escape(route.description);

  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'property', 'og:url', url);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);

  await mkdir(path.join(DIST, route.dir), { recursive: true });
  await writeFile(path.join(DIST, route.dir, 'index.html'), html, 'utf8');
  console.log(`prerendered /${route.dir}/`);
}
