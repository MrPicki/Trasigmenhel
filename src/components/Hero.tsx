import React, { useState } from 'react';
import PodcastPlayer from './PodcastPlayer';
import { Skeleton } from '@/components/ui/skeleton';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

interface HeroProps {
  episode: PodcastEpisode | null;
  isLoading: boolean;
  error: string | null;
}

const Hero = ({ episode, isLoading, error }: HeroProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="w-full">
      <div className="w-full relative">
        {!isImageLoaded && (
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <img
          src="/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png"
          alt="Trasig men Hel – podcast"
          className="w-full h-auto"
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>

      <div className="container px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="sr-only">Trasig men Hel – Podcast</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6">
            En ärlig och osminkad podcast om att bryta negativa mönster och hitta styrka i sårbarheten.
          </p>

          <div className="mx-auto max-w-2xl">
            <PodcastPlayer episode={episode} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
