import { useState, useEffect } from 'react';

interface PodcastEpisode {
  title: string;
  audioUrl: string;
  description: string;
  pubDate: string;
  duration: string;
}

export const usePodcastFeed = () => {
  const [latestEpisode, setLatestEpisode] = useState<PodcastEpisode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPodcastFeed = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://corsproxy.io/?" + 
          encodeURIComponent("https://anchor.fm/s/3c8f8270/podcast/rss"),
          {
            headers: {
              'Accept': 'application/xml, text/xml, */*'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Kunde inte hämta podcast-feeden');
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");

        if (xml.querySelector("parsererror")) {
          throw new Error('Kunde inte tolka podcast-feeden');
        }
        const item = xml.querySelector("item");

        if (!item) {
          throw new Error('Inga avsnitt hittades');
        }

        const episode: PodcastEpisode = {
          title: item.querySelector("title")?.textContent?.trim() || '',
          audioUrl: item.querySelector("enclosure")?.getAttribute("url") || '',
          description: item.querySelector("description")?.textContent?.replace(/<[^>]*>/g, '').trim() || '',
          pubDate: new Date(item.querySelector("pubDate")?.textContent || '').toLocaleDateString('sv-SE'),
          duration: item.querySelector("itunes\\:duration")?.textContent?.trim() || ''
        };

        // Validate the episode data
        if (!episode.title || !episode.audioUrl) {
          throw new Error('Ogiltig podcast-data');
        }

        setLatestEpisode(episode);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ett fel uppstod');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcastFeed();
  }, []);

  return { latestEpisode, isLoading, error };
};
