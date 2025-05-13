
import React, { useState } from 'react';
import PodcastPlayer from './PodcastPlayer';
import { Skeleton } from '@/components/ui/skeleton';

const Banner = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Image */}
      <div className="w-full relative">
        {!isImageLoaded && (
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <img 
          src="/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png" 
          alt="Trasig men Hel" 
          className="w-full h-auto"
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      
      {/* Audio Player Section */}
      <div className="container px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Trasig men Hel
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-300 mb-6">
            Podcast
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6">
            Lyssna på senaste avsnittet
          </p>
          
          <div className="mx-auto max-w-2xl">
            <PodcastPlayer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
