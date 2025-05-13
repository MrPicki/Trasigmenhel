
import React from 'react';
import PodcastPlayer from './PodcastPlayer';

const Banner = () => {
  return (
    <div className="w-full pt-16 pb-8">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Trasig men Hel
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-300 mb-2">
            Podcast
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mt-8 mb-6">
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
