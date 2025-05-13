
import React from 'react';
import Banner from '@/components/Banner';
import NewsletterForm from '@/components/NewsletterForm';
import PopularEpisodes from '@/components/PopularEpisodes';

const Index = () => {
  return (
    <main className="min-h-screen flex flex-col bg-charcoal-200">
      <Banner />
      <div className="component-transparent">
        <NewsletterForm />
      </div>
      <div className="component-transparent">
        <PopularEpisodes />
      </div>
      
      <footer className="w-full py-6 component-transparent">
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Trasig men hel. Alla rättigheter reserverade.
            </p>
            <a 
              href="/login" 
              className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1 border border-gray-700 rounded-md hover:border-gray-500"
            >
              Login
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
