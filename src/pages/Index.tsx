
import React, { useEffect } from 'react';
import Banner from '@/components/Banner';
import NewsletterForm from '@/components/NewsletterForm';
import PopularEpisodes from '@/components/PopularEpisodes';

const Index = () => {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-charcoal-200 flex flex-col relative">
      <Banner />
      <div className="relative z-10">
        <NewsletterForm />
        <PopularEpisodes />
      </div>
      
      <footer className="w-full bg-black py-6 relative z-10">
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
