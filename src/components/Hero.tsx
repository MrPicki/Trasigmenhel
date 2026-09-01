import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PodcastPlayer from './PodcastPlayer';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

interface HeroProps {
  episode: PodcastEpisode | null;
  isLoading: boolean;
  error: string | null;
}

const Hero = ({ episode, isLoading, error }: HeroProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <header className="w-full">
      <div className="relative w-full">
        {!isImageLoaded && <div className="w-full aspect-[16/7] bg-charcoal-100" aria-hidden="true" />}
        <img
          src="/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png"
          alt="Trasig men hel"
          className={`w-full h-auto transition-opacity duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          fetchPriority="high"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-b from-transparent to-charcoal-200 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      <div className="shell stage pt-8 pb-10 sm:pt-12 sm:pb-14">
        <h1 className="sr-only">Trasig men hel — podcast</h1>

        <p className="font-display text-[1.75rem] leading-[1.15] sm:text-[2.5rem] sm:leading-[1.1] text-bone-200 max-w-[30ch] text-balance">
          En ärlig och osminkad podd om att bryta negativa mönster och hitta styrka i sårbarheten.
        </p>

        <div className="mt-9 sm:mt-12">
          <PodcastPlayer episode={episode} isLoading={isLoading} error={error} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-bone-600">
          <Link
            to="/lankar"
            className="row-hover inline-flex items-center gap-1.5 text-bone-400 hover:text-bone-200 underline-offset-4 hover:underline"
          >
            Alla våra länkar
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <span className="hidden sm:inline text-charcoal-500" aria-hidden="true">/</span>
          <span>Nya avsnitt varannan vecka</span>
        </div>
      </div>
    </header>
  );
};

export default Hero;
