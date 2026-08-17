import React from 'react';
import EpisodeCard from './EpisodeCard';
import { ListMusic, Mic } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration, type PodcastEpisode } from '@/hooks/use-podcast-feed';

interface EpisodesSectionProps {
  episodes: PodcastEpisode[];
  isLoading: boolean;
  error: string | null;
  activeEpisodeId: string | null;
  onSelect: (episode: PodcastEpisode) => void;
}

const EpisodesSection = ({ episodes, isLoading, error, activeEpisodeId, onSelect }: EpisodesSectionProps) => {
  return (
    <section className="w-full bg-charcoal-200 py-10 sm:py-16">
      <div className="container px-4 sm:px-6">
        <div className="flex items-center justify-center mb-8 sm:mb-12">
          <ListMusic className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mr-2" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Avsnitt
          </h2>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <p className="text-center text-gray-400 max-w-md mx-auto">
            Kunde inte hämta avsnitten just nu. Prova igen om en stund, eller lyssna direkt på{' '}
            <a
              href="https://podcasters.spotify.com/pod/show/trasigmenhel"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-white"
            >
              Spotify
            </a>
            .
          </p>
        )}

        {!isLoading && !error && episodes.length === 0 && (
          <div className="text-center text-gray-400 max-w-md mx-auto flex flex-col items-center gap-3">
            <Mic className="h-8 w-8 opacity-50" />
            <p>Inga avsnitt publicerade än — det första släpps inom kort.</p>
          </div>
        )}

        {!isLoading && !error && episodes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {episodes.map((episode) => (
              <EpisodeCard
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
          </div>
        )}
      </div>
    </section>
  );
};

export default EpisodesSection;
