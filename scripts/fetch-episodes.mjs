#!/usr/bin/env node
/**
 * Hämtar poddflödet och skriver public/episodes.json.
 *
 * Varför: sajten läste flödet via api.rss2json.com vid varje sidladdning. Det
 * är en gratis tredjepartstjänst med hastighetsgränser mellan besökaren och
 * avsnitten — går den ner, eller svarar den långsamt, visar sajten inga
 * avsnitt alls. Nu läses avsnitten i stället från en fil som ligger på samma
 * domän som sajten, genererad här.
 *
 * Node kan hämta RSS-flödet direkt (ingen CORS-begränsning utanför webbläsaren),
 * så ingen mellanhand behövs.
 *
 * Körs före varje bygge i deploy.yml, och på schema i update-episodes.yml så
 * att ett nytt avsnitt hamnar på sajten även utan en ny commit.
 *
 * Nätverksfel är inte ett byggfel: finns en tidigare episodes.json behålls den
 * och skriptet avslutas med 0, så en tillfällig störning hos Spotify aldrig
 * stoppar en deploy.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_FILE = path.join(ROOT, 'public', 'episodes.json');
const FEED_URL = 'https://anchor.fm/s/3c8f8270/podcast/rss';

const decode = (text) =>
  text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const stripHtml = (html) => decode(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const tag = (xml, name) => {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decode(match[1]).trim() : '';
};

const attr = (xml, name, attribute) => {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?\\s${attribute}="([^"]*)"`, 'i'));
  return match ? decode(match[1]) : '';
};

/** itunes:duration is either seconds ("3133") or a clock ("52:13", "1:02:13"). */
const toSeconds = (value) => {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  const parts = value.split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
};

/** Apples id för podden, ur länken på /lankar. */
const APPLE_PODCAST_ID = '6807401829';

/**
 * Apples öppna sök-API listar varje avsnitt med sin egen adress. Ingen nyckel
 * krävs, så en knapp som går rakt in i rätt avsnitt kan hållas aktuell av sig
 * själv — vilket är hela poängen: en lyssnare som läser om del 2 ska inte
 * landa på poddens startsida och själv få leta.
 *
 * Matchas på titel, eftersom avsnittens id skiljer sig mellan Apples katalog
 * och RSS-flödet. Hittas ingen träff blir fältet null och sajten faller
 * tillbaka på poddens huvudadress.
 */
const appleEpisodeUrls = async () => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${APPLE_PODCAST_ID}&entity=podcastEpisode&limit=200&country=se`,
      { signal: AbortSignal.timeout(20000) }
    );
    if (!response.ok) throw new Error(`Apple svarade ${response.status}`);

    const data = await response.json();
    const map = new Map();
    for (const result of data.results || []) {
      if (result.wrapperType === 'podcastEpisode' && result.trackName && result.trackViewUrl) {
        // uo=4 är Apples spårningsparameter; den behövs inte.
        map.set(result.trackName.trim().toLowerCase(), result.trackViewUrl.replace(/[?&]uo=4\b/, ''));
      }
    }
    return map;
  } catch (error) {
    console.error(`Kunde inte hämta avsnittslänkar från Apple: ${error.message}`);
    return new Map();
  }
};

/**
 * Spotify har inget öppet motsvarande API: avsnittsadresser kräver en app med
 * client credentials. Finns SPOTIFY_CLIENT_ID och SPOTIFY_CLIENT_SECRET i
 * miljön används de; annars lämnas fältet null och knappen pekar på podden i
 * stället för på avsnittet. Inget går sönder av att de saknas.
 */
const SPOTIFY_SHOW_ID = '2N8p98KRnDw3OVsIwm6ArQ';

const spotifyEpisodeUrls = async () => {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return new Map();

  try {
    const auth = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
      signal: AbortSignal.timeout(20000),
    });
    if (!auth.ok) throw new Error(`token ${auth.status}`);
    const { access_token: token } = await auth.json();

    const response = await fetch(
      `https://api.spotify.com/v1/shows/${SPOTIFY_SHOW_ID}/episodes?market=SE&limit=50`,
      { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(20000) }
    );
    if (!response.ok) throw new Error(`episodes ${response.status}`);

    const data = await response.json();
    const map = new Map();
    for (const item of data.items || []) {
      if (item?.name && item?.external_urls?.spotify) {
        map.set(item.name.trim().toLowerCase(), item.external_urls.spotify);
      }
    }
    return map;
  } catch (error) {
    console.error(`Kunde inte hämta avsnittslänkar från Spotify: ${error.message}`);
    return new Map();
  }
};

async function main() {
  let xml;
  try {
    const response = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'trasigmenhel.se episode fetcher' },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`Flödet svarade ${response.status}`);
    xml = await response.text();
  } catch (error) {
    console.error(`Kunde inte hämta flödet: ${error.message}`);
    try {
      const existing = JSON.parse(await readFile(OUT_FILE, 'utf-8'));
      console.error(`Behåller befintlig episodes.json med ${existing.episodes.length} avsnitt.`);
      return;
    } catch {
      console.error('Ingen tidigare episodes.json att falla tillbaka på — skriver en tom fil.');
      await mkdir(path.dirname(OUT_FILE), { recursive: true });
      await writeFile(OUT_FILE, JSON.stringify({ generatedAt: null, feed: null, episodes: [] }, null, 2) + '\n');
      return;
    }
  }

  const firstItem = xml.search(/<item[\s>]/i);
  const channel = firstItem === -1 ? xml : xml.slice(0, firstItem);

  const feed = {
    title: stripHtml(tag(channel, 'title')),
    description: stripHtml(tag(channel, 'description') || tag(channel, 'itunes:summary')),
    image: attr(channel, 'itunes:image', 'href') || tag(tag(channel, 'image'), 'url'),
    link: tag(channel, 'link'),
  };

  const items = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);

  const episodes = items
    .map((item) => {
      const audioUrl = attr(item, 'enclosure', 'url');
      const pubDate = tag(item, 'pubDate');
      return {
        id: tag(item, 'guid') || tag(item, 'link') || audioUrl,
        title: stripHtml(tag(item, 'title')),
        audioUrl,
        description: stripHtml(tag(item, 'description') || tag(item, 'itunes:summary')),
        pubDateRaw: pubDate,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
        durationSeconds: toSeconds(tag(item, 'itunes:duration')),
        image: attr(item, 'itunes:image', 'href') || attr(item, 'media:thumbnail', 'url') || feed.image,
        link: tag(item, 'link'),
      };
    })
    .filter((episode) => episode.id && episode.title && episode.audioUrl)
    .sort((a, b) => {
      const at = a.publishedAt ? Date.parse(a.publishedAt) : NaN;
      const bt = b.publishedAt ? Date.parse(b.publishedAt) : NaN;
      if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
      if (Number.isNaN(at)) return 1;
      if (Number.isNaN(bt)) return -1;
      return bt - at;
    });

  if (episodes.length === 0) {
    console.error('Flödet gick att hämta men innehöll inga avsnitt med ljudfil — skriver inte över.');
    process.exitCode = 1;
    return;
  }

  const [apple, spotify] = await Promise.all([appleEpisodeUrls(), spotifyEpisodeUrls()]);

  for (const episode of episodes) {
    const key = episode.title.trim().toLowerCase();
    episode.appleUrl = apple.get(key) || null;
    episode.spotifyUrl = spotify.get(key) || null;
  }

  const withApple = episodes.filter((episode) => episode.appleUrl).length;
  const withSpotify = episodes.filter((episode) => episode.spotifyUrl).length;
  console.log(`Avsnittslänkar: ${withApple}/${episodes.length} Apple, ${withSpotify}/${episodes.length} Spotify.`);

  try {
    const existing = JSON.parse(await readFile(OUT_FILE, 'utf-8'));
    if (JSON.stringify({ feed: existing.feed, episodes: existing.episodes }) === JSON.stringify({ feed, episodes })) {
      console.log(`Inga avsnittsförändringar (${episodes.length} avsnitt). Filen lämnas orörd.`);
      return;
    }
  } catch {
    // The first successful fetch creates the file below.
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), feed, episodes }, null, 2) + '\n', 'utf-8');

  console.log(`Skrev ${episodes.length} avsnitt till public/episodes.json`);
  for (const episode of episodes) {
    console.log(`  ${episode.publishedAt?.slice(0, 10) ?? '????-??-??'}  ${Math.round(episode.durationSeconds / 60)} min  ${episode.title}`);
  }
}

await main();
