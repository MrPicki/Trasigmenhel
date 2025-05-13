
import React, { useEffect, useState } from 'react';
import Banner from '@/components/Banner';
import NewsletterForm from '@/components/NewsletterForm';
import PopularEpisodes from '@/components/PopularEpisodes';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Initialize parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      parallaxElements.forEach((element) => {
        const el = element as HTMLElement;
        el.style.transform = `translateY(${scrolled * 0.4}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Preload background image
    const img = new Image();
    img.src = "/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png";
    img.onload = () => setIsImageLoaded(true);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Parallax background */}
      <div className="fixed inset-0 parallax-bg -z-10">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <img 
          src="/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-85"
          style={{ objectPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-charcoal-200 opacity-80"></div>
      </div>
      
      {/* Content with transparency */}
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="component-transparent">
          <Banner />
        </div>
        <div className="component-transparent">
          <NewsletterForm />
        </div>
        <div className="component-transparent">
          <PopularEpisodes />
        </div>
      </div>
      
      <footer className="w-full py-6 relative z-10 component-transparent">
        <div className="container">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Trasig men hel. Alla rättigheter reserverade.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
