import React from 'react';
import EpisodeRow from './EpisodeRow';
import { formatDuration, type PodcastEpisode } from '@/hooks/use-podcast-feed';

const SPOTIFY_URL = 'https://podcasters.spotify.com/pod/show/trasigmenhel';

interface EpisodesSectionProps {
  episodes: PodcastEpisode[];
  isLoading: boolean;
  error: string | null;
  activeEpisodeId: string | null;
  onSelect: (episode: PodcastEpisode) => void;
}

const EpisodesSection = ({ episodes, isLoading, error, activeEpisodeId, onSelect }: EpisodesSectionProps) => (
  <section className="w-full py-14 sm:py-20" aria-labelledby="avsnitt">
    <div className="shell">
      <h2 id="avsnitt" className="text-2xl sm:text-3xl text-bone-200">
        Avsnitt
      </h2>

      <div className="mt-8 sm:mt-10">
        {isLoading && (
          <ul className="space-y-6" aria-busy="true" aria-label="Hämtar avsnitt">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex gap-4 border-t border-charcoal-400 pt-6 first:border-t-0 first:pt-0">
                <div className="h-16 w-16 flex-shrink-0 rounded bg-charcoal-300 animate-pulse sm:h-20 sm:w-20" />
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="h-3 w-24 rounded bg-charcoal-400 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-charcoal-300 animate-pulse" />
                  <div className="h-3 w-full rounded bg-charcoal-400 animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && error && (
          <p className="max-w-prose text-bone-400">
            Avsnitten gick inte att hämta just nu. Prova igen om en stund, eller lyssna direkt på{' '}
            <a
              href={SPOTIFY_URL}
              target="_blank"
              rel="noreferrer"
              className="text-bone-200 underline underline-offset-4 hover:no-underline"
            >
              Spotify
            </a>
            .
          </p>
        )}

        {!isLoading && !error && episodes.length === 0 && (
          <p className="max-w-prose text-bone-400">
            Inga avsnitt publicerade än — det första släpps inom kort.
          </p>
        )}

        {!isLoading && !error && episodes.length > 0 && (
          <ul>
            {episodes.map((episode) => (
              <EpisodeRow
                key={episode.id}
                title={episode.title}
                description={episode.description}
                imageUrl={episode.image}
                duration={formatDuration(episode.durationSeconds)}
                date={episode.pubDate}
                isActive={episode.id === activeEpisodeId}
                onPlay={() => onSelect(episode)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  </section>
);

export default EpisodesSection;
