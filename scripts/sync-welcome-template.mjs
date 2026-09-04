#!/usr/bin/env node
/**
 * Keeps the Brevo template used by the sign-up form populated with the newest
 * podcast episodes. The form sends this template immediately after a valid
 * sign-up, while the API key stays safely inside GitHub Actions.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildWelcomeEmailHtml, visibleEpisodes } from './newsletter-template.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const EPISODES_FILE = path.join(ROOT, 'public', 'episodes.json');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const TEMPLATE_ID = process.env.BREVO_WELCOME_TEMPLATE_ID || '5';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'mail@trasigmenhel.se';
const SENDER_NAME = process.env.SENDER_NAME || 'Trasig men Hel';
const DRY_RUN = process.env.DRY_RUN === 'true';

export async function loadEpisodes() {
  const data = JSON.parse(await readFile(EPISODES_FILE, 'utf-8'));
  if (!Array.isArray(data.episodes)) throw new Error('public/episodes.json saknar en avsnittslista.');
  return visibleEpisodes(data.episodes, 3);
}

async function findVerifiedSenderId() {
  const response = await fetch('https://api.brevo.com/v3/senders?domain=trasigmenhel.se', {
    headers: {
      'api-key': BREVO_API_KEY,
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Kunde inte läsa Brevos avsändare (${response.status}): ${body}`);
  }

  const data = await response.json();
  const sender = data.senders?.find(
    (candidate) => candidate.email?.toLowerCase() === SENDER_EMAIL.toLowerCase() && candidate.active !== false
  );
  if (!sender?.id) throw new Error(`${SENDER_EMAIL} finns inte som en verifierad Brevo-avsändare.`);
  return sender.id;
}

export async function syncWelcomeTemplate() {
  const episodes = await loadEpisodes();
  const payload = {
    templateName: 'Trasig men Hel – välkomstbrev',
    subject: 'Välkommen – här är de senaste avsnitten',
    sender: { name: SENDER_NAME, email: SENDER_EMAIL },
    replyTo: SENDER_EMAIL,
    htmlContent: buildWelcomeEmailHtml(episodes),
    isActive: true,
    tag: 'simple_confirmation',
  };

  console.log(`Välkomstmallen innehåller ${episodes.length} avsnitt:`);
  for (const episode of episodes) console.log(`  - ${episode.title}`);

  if (DRY_RUN) {
    console.log('DRY_RUN=true – Brevo uppdateras inte.');
    return payload;
  }

  if (!BREVO_API_KEY) throw new Error('BREVO_API_KEY saknas.');

  // Brevo's template endpoint requires the internal sender ID even though the
  // campaign endpoint accepts an email address. Resolve it at runtime so no
  // account-specific ID needs to be guessed or copied into the repository.
  const senderId = await findVerifiedSenderId();
  payload.sender = { name: SENDER_NAME, id: senderId };

  const response = await fetch(`https://api.brevo.com/v3/smtp/templates/${encodeURIComponent(TEMPLATE_ID)}`, {
    method: 'PUT',
    headers: {
      'api-key': BREVO_API_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo kunde inte uppdatera välkomstmallen (${response.status}): ${body}`);
  }

  console.log(`Brevo-mall #${TEMPLATE_ID} är uppdaterad med avsändaren ${SENDER_EMAIL}.`);
  return payload;
}

const isDirectRun = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirectRun) {
  syncWelcomeTemplate().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
