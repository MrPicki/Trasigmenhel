import React, { useState, useMemo } from 'react';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import EpisodesSection from '@/components/EpisodesSection';
import NewsletterForm from '@/components/NewsletterForm';
import SocialLinks from '@/components/SocialLinks';
import { usePodcastFeed, type PodcastEpisode } from '@/hooks/use-podcast-feed';

const Index = () => {
  const { episodes, feedInfo, isLoading, error } = usePodcastFeed();
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);

  const activeEpisode = useMemo(
    () => selectedEpisode ?? episodes[0] ?? null,
    [selectedEpisode, episodes]
  );

  return (
    <main className="min-h-screen flex flex-col bg-charcoal-200">
      <Hero episode={activeEpisode} isLoading={isLoading} error={error} />

      <AboutSection description={feedInfo?.description} />

      <EpisodesSection
        episodes={episodes}
        isLoading={isLoading}
        error={error}
        activeEpisodeId={activeEpisode?.id ?? null}
        onSelect={setSelectedEpisode}
      />

      <div className="component-transparent">
        <NewsletterForm />
      </div>

      <footer className="w-full py-10 component-transparent">
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-5">
            <SocialLinks />
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Trasig men hel. Alla rättigheter reserverade.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
