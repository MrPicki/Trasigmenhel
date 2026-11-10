#!/usr/bin/env node
/**
 * Hämtar klippen från YouTube-kanalen och skriver public/youtube.json.
 *
 * Varför bara YouTube, när podden också finns på Instagram, TikTok och
 * Facebook: YouTube publicerar ett öppet RSS-flöde per kanal. Ingen nyckel,
 * ingen app, ingen token som går ut. De andra kräver var sin OAuth-app med
 * token som måste förnyas — Instagram var 60:e dag — och den dagen en token
 * tyst slutar fungera står det "inga inlägg" på startsidan utan att någon
 * märker det. En trasig sektion är sämre än ingen sektion.
 *
 * Samma mönster som fetch-episodes.mjs: en fil på sajtens egen domän,
 * uppdaterad på schema, aldrig ett anrop från besökarens webbläsare till en
 * tredje part.
 *
 * Nätverksfel är inte ett byggfel: finns en tidigare youtube.json behålls den
 * och skriptet avslutas med 0.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_FILE = path.join(ROOT, 'public', 'youtube.json');

/** Kanalens id, inte @-namnet: RSS-flödet finns bara på id-formen. */
const CHANNEL_ID = 'UCN8bu7f0BbmUUte2VT-hWRA';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

/** Fler än så får ingen plats på startsidan, och filen ska vara liten. */
const KEEP = 9;

const decode = (text) =>
  text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');

const tag = (xml, name) => {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decode(match[1]).trim() : '';
};

/**
 * Titlarna är skrivna för YouTubes sökruta och slutar ofta i en rad
 * hashtaggar. De säger ingenting på en webbsida, så de trimmas bort på
 * samma sätt som i poddbeskrivningarna.
 */
const stripTrailingHashtags = (text) => text.replace(/(\s*#[^\s#]+)+\s*$/u, '').trim();

async function main() {
  let xml;
  try {
    const response = await fetch(FEED_URL, { headers: { 'user-agent': 'trasigmenhel.se' } });
    if (!response.ok) throw new Error(`YouTube svarade ${response.status}`);
    xml = await response.text();
  } catch (error) {
    console.error(`Kunde inte hämta YouTube-flödet: ${error.message}`);
    try {
      await readFile(OUT_FILE);
      console.error('Behåller befintlig youtube.json.');
      return;
    } catch {
      console.error('Ingen tidigare fil att behålla — skriver en tom lista.');
      await mkdir(path.dirname(OUT_FILE), { recursive: true });
      await writeFile(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), channel: null, videos: [] }, null, 2) + '\n');
      return;
    }
  }

  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);

  const videos = entries
    .map((entry) => {
      const id = tag(entry, 'yt:videoId');
      const title = stripTrailingHashtags(tag(entry, 'title'));
      const published = tag(entry, 'published');
      return id && title
        ? {
            id,
            title,
            published,
            url: `https://www.youtube.com/watch?v=${id}`,
            // Samma adress oavsett om klippet är en short eller en vanlig
            // video, och den finns alltid — till skillnad från maxres.
            thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .slice(0, KEEP);

  const data = {
    generatedAt: new Date().toISOString(),
    channel: {
      title: tag(xml, 'title') || 'Trasig men Hel',
      url: `https://www.youtube.com/channel/${CHANNEL_ID}`,
    },
    videos,
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(data, null, 2) + '\n');

  console.log(`Skrev ${videos.length} klipp till public/youtube.json`);
  for (const video of videos.slice(0, 5)) {
    console.log(`  ${video.published.slice(0, 10)}  ${video.title.slice(0, 60)}`);
  }
}

main();
