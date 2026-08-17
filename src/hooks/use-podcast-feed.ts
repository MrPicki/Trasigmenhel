import { useState, useEffect } from 'react';

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
        })).filter((ep: PodcastEpisode) => !!ep.audioUrl);

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
