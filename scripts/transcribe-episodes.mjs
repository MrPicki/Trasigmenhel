#!/usr/bin/env node
/**
 * Writes a transcript for every episode that does not have one.
 *
 * A transcript is the only thing on this site that can rank for what a
 * listener actually searches for. The episode titles and descriptions are a
 * few hundred words; an hour of talk is nine thousand, in the exact wording
 * someone types into Google at two in the morning. It is also what makes the
 * podcast readable for anyone who cannot or will not listen.
 *
 * Everything runs on this machine with whisper.cpp — no API key, no cost, and
 * no audio leaves the computer:
 *
 *     brew install whisper-cpp
 *     npm run transcribe
 *
 * The model is the same one the Samtalsklipp project downloads, so it is
 * usually already there. Point TRANSCRIBE_MODEL elsewhere if not.
 *
 * Results land in public/transcripts/<slug>.json and are committed. The build
 * inlines them into the episode pages; nothing fetches them at runtime unless
 * a visitor navigates in from another page.
 */
import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'transcripts');
const WORK = process.env.TRANSCRIBE_WORK_DIR || path.join(ROOT, '.transcribe-cache');

const WHISPER = process.env.TRANSCRIBE_BIN || 'whisper-cli';
const MODEL =
  process.env.TRANSCRIBE_MODEL ||
  path.join(process.env.HOME || '', '.samtalsklipp', 'modeller', 'ggml-large-v3-turbo.bin');
const VAD =
  process.env.TRANSCRIBE_VAD ||
  path.join(process.env.HOME || '', '.samtalsklipp', 'modeller', 'ggml-silero-v5.1.2.bin');

const SOURCE = 'whisper.cpp (large-v3-turbo) lokalt';

const exists = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

/** Anchor wraps the real file in a tracking URL with the mp3 on the end. */
const mp3From = (audioUrl) => {
  const match = audioUrl.match(/\/(https?%3A%2F%2F.+?\.mp3)(?:\?|$)/i);
  return match ? decodeURIComponent(match[1]) : audioUrl;
};

const { slugFor } = await import('./lib/episode-slug.mjs');

const feed = JSON.parse(await readFile(path.join(ROOT, 'public', 'episodes.json'), 'utf8'));
const episodes = (feed.episodes || []).filter((episode) => episode.audioUrl);

await mkdir(OUT, { recursive: true });
await mkdir(WORK, { recursive: true });

if (!(await exists(MODEL))) {
  console.error(
    `Hittar ingen Whisper-modell på ${MODEL}.\n` +
      'Sätt TRANSCRIBE_MODEL till din .bin-fil, eller hämta large-v3-turbo från whisper.cpp.'
  );
  process.exit(1);
}

let written = 0;

for (const episode of episodes) {
  const slug = slugFor(episode);
  const target = path.join(OUT, `${slug}.json`);

  if (await exists(target)) {
    console.log(`• ${slug} — har redan transkript`);
    continue;
  }

  const mp3 = path.join(WORK, `${episode.id}.mp3`);
  const wav = path.join(WORK, `${episode.id}.wav`);
  const raw = path.join(WORK, `${episode.id}.json`);

  if (!(await exists(raw))) {
    if (!(await exists(mp3))) {
      console.log(`↓ ${slug} — hämtar ljudet`);
      await run('curl', ['-sL', mp3From(episode.audioUrl), '-o', mp3]);
    }
    if (!(await exists(wav))) {
      // whisper.cpp wants 16 kHz mono PCM. afconvert ships with macOS, so
      // this works without installing ffmpeg.
      console.log(`↺ ${slug} — konverterar`);
      await run('afconvert', ['-f', 'WAVE', '-d', 'LEI16@16000', '-c', '1', mp3, wav]);
    }

    console.log(`⠿ ${slug} — transkriberar (tar några minuter)`);
    await run(
      WHISPER,
      [
        '-m', MODEL,
        '-f', wav,
        '-l', 'sv',
        '--vad',
        '--vad-model', VAD,
        '-oj',
        '-of', path.join(WORK, episode.id),
        '-np',
        '-nt',
      ],
      { maxBuffer: 1024 * 1024 * 64 }
    );
  }

  const parsed = JSON.parse(await readFile(raw, 'utf8'));
  const segments = (parsed.transcription || [])
    .map((entry) => ({
      start: Math.round(((entry.offsets?.from ?? 0) / 1000) * 10) / 10,
      text: (entry.text || '').trim(),
    }))
    .filter((segment) => segment.text);

  if (segments.length === 0) {
    console.warn(`! ${slug} — whisper gav inga segment, hoppar över`);
    continue;
  }

  await writeFile(
    target,
    JSON.stringify(
      { slug, generatedAt: new Date().toISOString(), source: SOURCE, segments },
      null,
      1
    ) + '\n'
  );
  written += 1;
  console.log(`✓ ${slug} — ${segments.length} segment`);
}

console.log(`\nKlart. ${written} nya transkript i public/transcripts/.`);
