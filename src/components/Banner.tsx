
import React, { useState } from 'react';
import PodcastPlayer from './PodcastPlayer';
import { Skeleton } from '@/components/ui/skeleton';

const Banner = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="w-full bg-charcoal-200">
      {/* Top bar image */}
      <div className="w-full bg-charcoal-200 relative">
        {!isImageLoaded && (
          <div className="w-full h-24 sm:h-32 md:h-40 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <img 
          src="/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png" 
          alt="Trasig men Hel" 
          className="w-full h-auto object-contain max-h-24 sm:max-h-32 md:max-h-40"
          style={{ 
            objectPosition: 'center',
            maxWidth: '100%'
          }}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      
      {/* Content */}
      <div className="container px-4 py-8 sm:py-10 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
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
