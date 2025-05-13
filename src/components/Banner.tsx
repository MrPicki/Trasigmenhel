
import React, { useState, useEffect } from 'react';
import PodcastPlayer from './PodcastPlayer';
import { Skeleton } from '@/components/ui/skeleton';

const Banner = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png";
    img.onload = () => setIsImageLoaded(true);
    
    // Add parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      parallaxElements.forEach((element) => {
        const el = element as HTMLElement;
        el.style.transform = `translateY(${scrolled * 0.4}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full bg-charcoal-200 overflow-hidden min-h-[400px] sm:min-h-[500px]">
      {/* Background elements */}
      <div className="absolute inset-0 typography-texture opacity-20"></div>
      {!isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      {/* Background with parallax effect */}
      <div className="absolute inset-0 parallax-bg">
        <div className="absolute inset-0 bg-charcoal-200"></div>
        <img 
          src="/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png" 
          alt="" 
          className="absolute inset-0 w-full h-full object-contain md:object-cover opacity-90"
          style={{ 
            objectPosition: 'center',
            objectFit: 'contain',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
        <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-transparent to-charcoal-200"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 pt-20 pb-12 sm:pt-24 md:pt-32 md:pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-12">
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
