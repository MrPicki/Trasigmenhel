#!/usr/bin/env node
/**
 * Tells Bing and the engines that share its index that the site changed.
 *
 * Google finds new pages on its own schedule, which for a small site can be
 * weeks. IndexNow is the opposite arrangement: the site says "these addresses
 * changed" and the engines come and look, usually within hours. Bing,
 * DuckDuckGo (which uses Bing's index), Yandex, Seznam and Naver all accept
 * it, and the same signal increasingly feeds the AI assistants that answer
 * questions from Bing's index.
 *
 * The key is not a secret. The protocol works by publishing it at
 * trasigmenhel.se/<key>.txt — that file is how an engine checks that whoever
 * submitted the URLs controls the domain.
 *
 * Runs from the deploy workflow after a successful deploy, and submits
 * exactly the addresses in the sitemap that was just published.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'trasigmenhel.se';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

const keyFile = (await readdir(path.join(ROOT, 'public'))).find((name) =>
  /^[0-9a-f]{16,}\.txt$/.test(name)
);

if (!keyFile) {
  console.error('Ingen IndexNow-nyckel i public/. Hoppar över.');
  process.exit(0);
}

const key = keyFile.replace(/\.txt$/, '');
/**
 * The live sitemap, so the addresses submitted are the ones actually being
 * served. Falls back to the build output when run locally without a deploy.
 */
const loadSitemap = async () => {
  try {
    const response = await fetch(`https://${HOST}/sitemap.xml`, { cache: 'no-store' });
    if (response.ok) return await response.text();
  } catch {
    // Offline or the site is down; the build output still describes it.
  }
  return readFile(path.join(ROOT, 'dist', 'sitemap.xml'), 'utf8');
};

const sitemap = await loadSitemap();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

if (urlList.length === 0) {
  console.error('Sitemapen innehöll inga adresser. Hoppar över.');
  process.exit(0);
}

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${keyFile}`,
    urlList,
  }),
});

// 200 and 202 both mean accepted; anything else is worth seeing in the log,
// but never worth failing a deploy that already went out.
console.log(`IndexNow svarade ${response.status} för ${urlList.length} adresser.`);
if (!response.ok) console.log(await response.text());
