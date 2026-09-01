import { useState, useEffect } from 'react';
import { EPISODES } from '@/config/site';

export interface PodcastEpisode {
  id: string;
  title: string;
  audioUrl: string;
  description: string;
  pubDate: string;
  pubDateRaw: string;
  durationSeconds: number;
  image: string;
  link: string;
}

export interface PodcastFeedInfo {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface FeedState {
  episodes: PodcastEpisode[];
  feedInfo: PodcastFeedInfo | null;
  isLoading: boolean;
  error: string | null;
}

interface Rss2JsonItem {
  guid?: string;
  link?: string;
  title?: string;
  description?: string;
  content?: string;
  pubDate?: string;
  thumbnail?: string;
  enclosure?: {
    link?: string;
    duration?: number | string;
    image?: string;
  };
}

const FEED_URL = 'https://anchor.fm/s/3c8f8270/podcast/rss';

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();

// RSS descriptions often end with a run of social hashtags meant for other
// platforms (#TrasigMenHel #PersonligUtveckling ...). They're real content,
// but read as noise inside a webpage paragraph, so trim a trailing hashtag
// run for display rather than fabricating replacement copy.
const stripTrailingHashtags = (text: string) =>
  text.replace(/(\s*#[^\s#]+){2,}\s*$/u, '').trim();

/**
 * rss2json hands back dates as "2026-09-01 05:00:00" while raw RSS uses
 * "Mon, 01 Sep 2026 05:00:00 GMT". Safari refuses the first form, so
 * normalise it before parsing rather than trusting `new Date` with either.
 */
const toTimestamp = (value: string) => {
  if (!value) return NaN;
  const normalised = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
    ? value.replace(' ', 'T') + 'Z'
    : value;
  return new Date(normalised).getTime();
};

const isHidden = (title: string) =>
  EPISODES.hiddenTitlePatterns.some((pattern) => pattern.test(title));

const matchesFeatured = (episode: PodcastEpisode, match: string | RegExp) =>
  match instanceof RegExp
    ? match.test(episode.title) || match.test(episode.id)
    : episode.title.toLowerCase().includes(match.toLowerCase()) || episode.id === match;

const formatDuration = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) return '';
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

/**
 * Fetches the real "Trasig men Hel" episode feed once and shares it across
 * every component that needs episode data (hero player + episode list),
 * so the site never falls back to placeholder content.
 */
export const usePodcastFeed = () => {
  const [state, setState] = useState<FeedState>({
    episodes: [],
    feedInfo: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchFeed = async () => {
      try {
        const response = await fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(FEED_URL)
        );

        if (!response.ok) throw new Error('Kunde inte hämta poddflödet');

        const data = await response.json();
        if (data.status !== 'ok' || !Array.isArray(data.items)) {
          throw new Error('Poddflödet kunde inte tolkas');
        }

        const episodes: PodcastEpisode[] = (data.items as Rss2JsonItem[]).map((item) => ({
          id: item.guid || item.link,
          title: stripHtml(item.title || ''),
          audioUrl: item.enclosure?.link || '',
          description: stripHtml(item.description || item.content || ''),
          pubDate: item.pubDate
            ? new Date(item.pubDate).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })
            : '',
          pubDateRaw: item.pubDate || '',
          durationSeconds: Number(item.enclosure?.duration) || 0,
          image: item.thumbnail || item.enclosure?.image || data.feed?.image || '',
          link: item.link || '',
        }))
          .filter((ep: PodcastEpisode) => !!ep.audioUrl && !isHidden(ep.title))
          // The feed's own order is not dependable, so sort here. Newest
          // first; anything with an unparseable date keeps its feed position
          // at the end rather than jumping to the top.
          .sort((a: PodcastEpisode, b: PodcastEpisode) => {
            const at = toTimestamp(a.pubDateRaw);
            const bt = toTimestamp(b.pubDateRaw);
            if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
            if (Number.isNaN(at)) return 1;
            if (Number.isNaN(bt)) return -1;
            return bt - at;
          });

        // A pinned episode leads the page regardless of publish date.
        if (EPISODES.featuredMatch) {
          const index = episodes.findIndex((ep) => matchesFeatured(ep, EPISODES.featuredMatch!));
          if (index > 0) episodes.unshift(...episodes.splice(index, 1));
        }

        if (!cancelled) {
          setState({
            episodes,
            feedInfo: data.feed
              ? {
                  title: stripHtml(data.feed.title || ''),
                  description: stripTrailingHashtags(stripHtml(data.feed.description || '')),
                  image: data.feed.image || '',
                  link: data.feed.link || '',
                }
              : null,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            episodes: [],
            feedInfo: null,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Ett fel uppstod',
          });
        }
      }
    };

    fetchFeed();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};

export { formatDuration };
