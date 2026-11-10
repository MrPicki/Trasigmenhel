#!/usr/bin/env node
/**
 * Writes every page of the site to disk as finished HTML.
 *
 * GitHub Pages serves files, not an application. Without this step the only
 * file that exists is index.html, and every route is answered by a 404 page
 * plus a redirect — which works for a person with JavaScript, and not at all
 * for a crawler that reads the HTML and moves on. A search engine then has
 * one page to index for a podcast with hours of material in it.
 *
 * So after the client build, the same React tree is rendered on the server
 * (dist-ssr/entry-prerender.js) once per route, and each result is written to
 * its own index.html with that page's own title, description, canonical URL,
 * Open Graph tags and schema.org data. The data the page was rendered from is
 * inlined as window.__PRELOAD__, so the browser starts from the finished list
 * instead of blanking and fetching it again.
 *
 * Runs automatically after `npm run build` (npm's postbuild hook), so
 * `npm run deploy` picks it up with no extra step.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-prerender.js');
const SITE = 'https://trasigmenhel.se';

const { render, episodeRoutes } = await import(pathToFileURL(SSR_ENTRY).href);

const feedData = JSON.parse(await readFile(path.join(ROOT, 'public', 'episodes.json'), 'utf8'));
const rawEpisodes = Array.isArray(feedData.episodes) ? feedData.episodes : [];
const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

/**
 * The template carries a full set of meta tags for the home page so the dev
 * server and any un-prerendered fallback still preview correctly. Each
 * prerendered page replaces them with its own, so the originals are stripped
 * first — two <title> tags is not a page with a title, it is a page with a
 * bug.
 */
const stripManagedHead = (html) =>
  html
    .replace(/\n?[ \t]*<title>[\s\S]*?<\/title>/i, '')
    .replace(
      /\n?[ \t]*<meta\s+(?:name|property)="(?:title|description|author|viewport|theme-color|language|keywords|og:[^"]*|twitter:[^"]*)"[^>]*>/gi,
      ''
    )
    .replace(/\n?[ \t]*<link\s+rel="(?:canonical|icon|apple-touch-icon)"[^>]*>/gi, '');

/** JSON that is safe to sit inside a <script> element. */
const inlineJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028')
    .replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');

const buildPage = ({ html, head, preload }) =>
  stripManagedHead(template)
    .replace('</head>', `    ${head}\n  </head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>\n    <script>window.__PRELOAD__=${inlineJson(preload)}</script>`
    );

const writePage = async (route, contents) => {
  const dir = route === '/' ? DIST : path.join(DIST, route.replace(/^\/|\/$/g, ''));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), contents);
};

/** Transcripts live next to the site as plain files; the page that needs one
 *  gets it inlined so the text is in the HTML a crawler reads. */
const transcriptFor = async (slug) => {
  try {
    return JSON.parse(await readFile(path.join(ROOT, 'public', 'transcripts', `${slug}.json`), 'utf8'));
  } catch {
    return null;
  }
};

/** The episode's own share image, if `npm run og` has drawn one. */
const ogImageFor = async (slug) => {
  try {
    await readFile(path.join(ROOT, 'public', 'og', `${slug}.png`));
    return `/og/${slug}.png`;
  } catch {
    return null;
  }
};

const feed = feedData.feed ?? null;
const basePreload = { episodes: rawEpisodes, feed };

const written = [];

// 1. The two standing pages.
for (const route of ['/', '/lankar']) {
  const { html, head } = render(route, basePreload);
  await writePage(route, buildPage({ html, head, preload: basePreload }));
  written.push({ route, changefreq: route === '/' ? 'weekly' : 'monthly', priority: route === '/' ? '1.0' : '0.6' });
}

// 2. One page per episode.
const routes = episodeRoutes(rawEpisodes);
let withTranscript = 0;

for (const route of routes) {
  const transcript = await transcriptFor(route.slug);
  if (transcript) withTranscript += 1;

  const preload = { ...basePreload, transcript, ogImage: await ogImageFor(route.slug) };
  const { html, head } = render(route.path, preload);
  await writePage(route.path, buildPage({ html, head, preload }));
  written.push({
    route: route.path,
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: route.published || undefined,
  });
}

// 3. Alias paths. The router sends /links to /lankar for anyone with
//    JavaScript, but GitHub Pages answers the address itself with a 404 —
//    which is what a crawler records. A real file with a canonical link says
//    the same thing in the form a search engine acts on, and is kept out of
//    the sitemap so only the canonical address is submitted.
const ALIASES = [{ from: 'links', to: '/lankar' }];

for (const alias of ALIASES) {
  const target = `${SITE}${alias.to}`;
  const html = `<!doctype html>
<html lang="sv">
  <head>
    <meta charset="UTF-8" />
    <title>Länkar | Trasig men Hel</title>
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <meta name="robots" content="noindex, follow" />
  </head>
  <body>
    <p>Sidan finns på <a href="${target}">${target}</a>.</p>
  </body>
</html>
`;
  await mkdir(path.join(DIST, alias.from), { recursive: true });
  await writeFile(path.join(DIST, alias.from, 'index.html'), html);
}

// 3. The sitemap, listing exactly the pages that were written. Generated
//    rather than maintained by hand: a sitemap that lists a page which does
//    not exist, or omits one that does, is worse than none.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${written
  .map(
    ({ route, changefreq, priority, lastmod }) =>
      `  <url>\n    <loc>${SITE}${route === '/' ? '/' : route}</loc>\n${
        lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''
      }    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`;
await writeFile(path.join(DIST, 'sitemap.xml'), sitemap);

// 5. The 404 that GitHub Pages serves for anything else keeps the SPA
//    redirect, but should still describe itself properly.
try {
  const notFound = await readFile(path.join(DIST, '404.html'), 'utf8');
  if (!notFound.includes('<title>')) {
    await writeFile(
      path.join(DIST, '404.html'),
      notFound.replace('<head>', '<head>\n    <title>Sidan hittades inte | Trasig men Hel</title>')
    );
  }
} catch {
  // No 404.html in the build; nothing to adjust.
}

const transcriptDir = path.join(ROOT, 'public', 'transcripts');
let available = 0;
try {
  available = (await readdir(transcriptDir)).filter((name) => name.endsWith('.json')).length;
} catch {
  available = 0;
}

console.log(
  `Prerendered ${written.length} sidor (${routes.length} avsnitt, ${withTranscript}/${available || routes.length} med transkript) och skrev sitemap.xml`
);
