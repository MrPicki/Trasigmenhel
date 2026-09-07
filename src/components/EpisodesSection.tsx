import React from 'react';
import EpisodeRow from './EpisodeRow';
import { SPOTIFY_URL } from '@/config/site';
import { usePlayer } from '@/player/PlayerProvider';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

interface EpisodesSectionProps {
  episodes: PodcastEpisode[];
  isLoading: boolean;
  error: string | null;
}

/**
 * The register. This is where the page turns from ink to paper — the one
 * hard edge on the site, and the reason the hero can be as dark as it is.
 */
const EpisodesSection = ({ episodes, isLoading, error }: EpisodesSectionProps) => {
  const { toggle, isPlaying, isCurrent } = usePlayer();

  return (
    <section className="bg-paper text-ink" aria-labelledby="avsnitt">
      <div className="shell">
        <div className="flex items-baseline justify-between border-b border-ink py-5">
          <h2 id="avsnitt" className="text-2xl tracking-tight sm:text-3xl">
            Avsnitt
          </h2>
          <span className="label tnum text-paper-600">
            {isLoading ? 'Hämtar' : `${String(episodes.length).padStart(2, '0')} i registret`}
          </span>
        </div>

        {isLoading && (
          <ul aria-busy="true" aria-label="Hämtar avsnitt">
            {[0, 1].map((i) => (
              <li key={i} className="border-t border-paper-400 first:border-t-0">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 py-10 sm:grid-cols-[5.5rem_1fr] sm:gap-x-8">
                  <div className="h-3 w-10 animate-pulse bg-paper-300" />
                  <div className="space-y-4">
                    <div className="h-3 w-40 animate-pulse bg-paper-300" />
                    <div className="h-9 w-3/4 animate-pulse bg-paper-300" />
                    <div className="h-3 w-full animate-pulse bg-paper-300" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && error && (
          <p className="max-w-prose py-12 text-paper-700">
            Avsnitten gick inte att hämta just nu. Prova igen om en stund, eller lyssna direkt på{' '}
            <a
              href={SPOTIFY_URL}
              target="_blank"
              rel="noreferrer"
              className="text-ink underline underline-offset-4 hover:no-underline"
            >
              Spotify
            </a>
            .
          </p>
        )}

        {!isLoading && !error && episodes.length === 0 && (
          <p className="max-w-prose py-12 text-paper-700">
            Registret är tomt än så länge — det första avsnittet släpps inom kort.
          </p>
        )}

        {!isLoading && !error && episodes.length > 0 && (
          <ul>
            {episodes.map((episode, index) => (
              <EpisodeRow
                key={episode.id}
                episode={episode}
                number={episodes.length - index}
                isCurrent={isCurrent(episode)}
                isPlaying={isPlaying}
                onToggle={() => toggle(episode)}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default EpisodesSection;
