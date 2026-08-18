#!/usr/bin/env node
/**
 * Checks the real "Trasig men Hel" RSS feed for a new episode and, if one is
 * found, sends an email campaign about it to the Brevo newsletter list —
 * fully automatically, with no human in the loop.
 *
 * Run on a schedule by .github/workflows/notify-episode.yml. State (which
 * episode we last notified about) is tracked in data/last-notified-episode.json,
 * committed back to the repo by the workflow after each run, so re-runs never
 * send a duplicate email for an episode that's already gone out.
 *
 * Required environment variables (set as GitHub Actions secrets):
 *   BREVO_API_KEY   - Brevo API key (Settings -> SMTP & API -> API keys)
 * Optional:
 *   BREVO_LIST_ID   - defaults to 3 ("Nyhetsbrev - Trasig men Hel")
 *   SENDER_EMAIL    - defaults to kontakt@trasigmenhel.se (verified Brevo sender)
 *   SENDER_NAME     - defaults to "Trasig men Hel"
 *   DRY_RUN         - set to "true" to log what would happen without calling Brevo
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, '..', 'data', 'last-notified-episode.json');

const FEED_URL = 'https://anchor.fm/s/3c8f8270/podcast/rss';
const SITE_URL = 'https://trasigmenhel.se';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID || '3');
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'kontakt@trasigmenhel.se';
const SENDER_NAME = process.env.SENDER_NAME || 'Trasig men Hel';
const DRY_RUN = process.env.DRY_RUN === 'true';

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!match) return '';
  return match[1]
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .trim();
}

function extractAttr(xml, tag, attr) {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*/?>`, 'i'));
  return match ? match[1] : '';
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

function parseLatestEpisode(rssXml) {
  const firstItemMatch = rssXml.match(/<item>([\s\S]*?)<\/item>/i);
  if (!firstItemMatch) return null;
  const item = firstItemMatch[1];

  const guid = extractTag(item, 'guid') || extractTag(item, 'link');
  const title = stripHtml(extractTag(item, 'title'));
  const link = extractTag(item, 'link');
  const pubDate = extractTag(item, 'pubDate');
  const rawDescription = extractTag(item, 'description') || extractTag(item, 'itunes:summary');
  const description = stripHtml(rawDescription);
  const audioUrl = extractAttr(item, 'enclosure', 'url');

  if (!guid || !title) return null;

  return { guid, title, link: link || SITE_URL, pubDate, description, audioUrl };
}

async function loadState() {
  try {
    const raw = await readFile(STATE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { lastNotifiedGuid: null };
  }
}

async function saveState(state) {
  await mkdir(path.dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf-8');
}

function buildEmailHtml(episode) {
  const description = episode.description
    ? `<p style="color:#444;line-height:1.6;">${episode.description.slice(0, 600)}</p>`
    : '';

  return `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px 24px;">
    <p style="text-transform:uppercase;letter-spacing:1px;font-size:12px;color:#999;margin:0 0 8px;">Nytt avsnitt av Trasig men Hel</p>
    <h1 style="font-size:24px;margin:0 0 16px;">${episode.title}</h1>
    ${description}
    <p style="margin:32px 0 0;">
      <a href="${episode.link}" style="display:inline-block;background:#fff;color:#0a0a0a;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:4px;">Lyssna nu</a>
    </p>
    <p style="margin-top:32px;font-size:13px;color:#888;">Du får det här mailet för att du prenumererar på nyhetsbrevet från Trasig men Hel.</p>
  </div>`;
}

async function sendCampaign(episode) {
  const headers = {
    'api-key': BREVO_API_KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: `Nytt avsnitt: ${episode.title} (${new Date().toISOString().slice(0, 10)})`,
      subject: `Nytt avsnitt: ${episode.title}`,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      type: 'classic',
      htmlContent: buildEmailHtml(episode),
      recipients: { listIds: [BREVO_LIST_ID] },
    }),
  });

  if (!createRes.ok) {
    const body = await createRes.text();
    throw new Error(`Brevo campaign creation failed (${createRes.status}): ${body}`);
  }

  const { id } = await createRes.json();
  console.log(`Skapade Brevo-kampanj #${id}`);

  const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${id}/sendNow`, {
    method: 'POST',
    headers,
  });

  if (!sendRes.ok) {
    const body = await sendRes.text();
    throw new Error(`Brevo campaign send failed (${sendRes.status}): ${body}`);
  }

  console.log(`Skickade kampanj #${id} till lista ${BREVO_LIST_ID}`);
}

async function main() {
  console.log(`Hämtar flöde: ${FEED_URL}`);
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`Kunde inte hämta RSS-flödet: ${res.status}`);
  const xml = await res.text();

  const episode = parseLatestEpisode(xml);
  if (!episode) {
    console.log('Hittade inget avsnitt i flödet. Avbryter.');
    return;
  }

  const state = await loadState();
  if (state.lastNotifiedGuid === episode.guid) {
    console.log(`Inget nytt avsnitt (senaste: "${episode.title}"). Inget mail skickas.`);
    return;
  }

  console.log(`Nytt avsnitt hittat: "${episode.title}" (guid: ${episode.guid})`);

  if (DRY_RUN) {
    console.log('DRY_RUN=true – skickar inget mail, uppdaterar inte state.');
    return;
  }

  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY saknas. Sätt den som en GitHub Actions secret.');
  }

  await sendCampaign(episode);

  await saveState({
    lastNotifiedGuid: episode.guid,
    lastNotifiedTitle: episode.title,
    notifiedAt: new Date().toISOString(),
  });

  console.log('Klart.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
