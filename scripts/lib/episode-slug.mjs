/**
 * The slug rule, in a form Node scripts can import.
 *
 * It has to agree with src/lib/episodes.ts exactly — a transcript written
 * under a different slug than the page looks for is a transcript that never
 * appears. The hand-written slugs in src/config/site.ts are read from there
 * so the two files cannot drift.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const SWEDISH = { å: 'a', ä: 'a', ö: 'o', é: 'e', ü: 'u', æ: 'ae', ø: 'o' };

export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[åäöéüæø]/g, (char) => SWEDISH[char] ?? char)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'avsnitt';

/** The hand-written { id: { slug } } entries from src/config/site.ts. */
const declared = async () => {
  const source = await readFile(path.join(ROOT, 'src', 'config', 'site.ts'), 'utf8');
  const block = source.match(/EPISODE_PAGES:\s*Record<string,\s*EpisodePage>\s*=\s*\{([\s\S]*?)\n\};/);
  if (!block) return {};

  const map = {};
  const entry = /['"]([^'"]+)['"]\s*:\s*\{[\s\S]*?slug:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = entry.exec(block[1])) !== null) map[match[1]] = match[2];
  return map;
};

const DECLARED = await declared();

export const slugFor = (episode) => DECLARED[episode.id] ?? slugify(episode.title);
