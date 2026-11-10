import { EPISODE_PAGES, type EpisodePage } from '@/config/site';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

/**
 * Where an episode lives on the site.
 *
 * The slug is the one part of a URL that must never move: a link shared on
 * Instagram in March has to still work in December, and Google drops the
 * ranking of anything that 404s. So the slug is declared by hand in
 * src/config/site.ts, keyed by the episode's feed id, and the title the feed
 * happens to carry at the moment is only a fallback for an episode nobody has
 * written an entry for yet.
 */

const SWEDISH = new Map<string, string>([
  ['å', 'a'],
  ['ä', 'a'],
  ['ö', 'o'],
  ['é', 'e'],
  ['ü', 'u'],
  ['æ', 'ae'],
  ['ø', 'o'],
]);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[åäöéüæø]/g, (char) => SWEDISH.get(char) ?? char)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'avsnitt';

export const pageFor = (episode: Pick<PodcastEpisode, 'id' | 'title'>): EpisodePage =>
  EPISODE_PAGES[episode.id] ?? { slug: slugify(episode.title) };

export const slugFor = (episode: Pick<PodcastEpisode, 'id' | 'title'>) => pageFor(episode).slug;

/** The title the site shows — the searchable one when it has been written. */
export const titleFor = (episode: Pick<PodcastEpisode, 'id' | 'title'>) =>
  pageFor(episode).title ?? episode.title;

export const pathFor = (episode: Pick<PodcastEpisode, 'id' | 'title'>) =>
  `/avsnitt/${slugFor(episode)}`;

export const findBySlug = (episodes: PodcastEpisode[], slug: string) =>
  episodes.find((episode) => slugFor(episode) === slug) ?? null;

/** A meta description: the written summary, or the feed text cut to one. */
export const summaryFor = (episode: Pick<PodcastEpisode, 'id' | 'title' | 'description'>) => {
  const written = pageFor(episode).summary;
  if (written) return written;

  const text = (episode.description || '').replace(/\s+/g, ' ').trim();
  if (text.length <= 160) return text;

  const cut = text.slice(0, 160);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (lastStop > 80) return cut.slice(0, lastStop + 1);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
};

/** ISO 8601 duration, the only form schema.org accepts. */
export const isoDuration = (seconds: number) => {
  if (!seconds || !Number.isFinite(seconds)) return undefined;
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}`;
};

/** YYYY-MM-DD, for <time dateTime> and schema.org datePublished. */
export const isoDate = (pubDateRaw: string) => {
  const normalised = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(pubDateRaw)
    ? pubDateRaw.replace(' ', 'T') + 'Z'
    : pubDateRaw;
  const time = new Date(normalised).getTime();
  return Number.isNaN(time) ? '' : new Date(time).toISOString().slice(0, 10);
};
