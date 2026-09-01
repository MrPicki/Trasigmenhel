import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import EpisodesSection from '@/components/EpisodesSection';
import NewsletterForm from '@/components/NewsletterForm';
import SocialLinks from '@/components/SocialLinks';
import { usePodcastFeed, type PodcastEpisode } from '@/hooks/use-podcast-feed';

const Index = () => {
  const { episodes, feedInfo, isLoading, error } = usePodcastFeed();
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);

  // The feed arrives sorted newest-first (see use-podcast-feed), so the first
  // entry is the current episode until the visitor picks another one.
  const activeEpisode = useMemo(
    () => selectedEpisode ?? episodes[0] ?? null,
    [selectedEpisode, episodes]
  );

  return (
    <main className="flex min-h-screen flex-col bg-charcoal-200">
      <Hero episode={activeEpisode} isLoading={isLoading} error={error} />

      <EpisodesSection
        episodes={episodes}
        isLoading={isLoading}
        error={error}
        activeEpisodeId={activeEpisode?.id ?? null}
        onSelect={setSelectedEpisode}
      />

      <AboutSection description={feedInfo?.description} />

      <NewsletterForm />

      <footer className="w-full py-12 sm:py-16">
        <div className="shell flex flex-col items-center gap-6 text-center">
          <SocialLinks />
          <Link
            to="/lankar"
            className="row-hover text-sm text-bone-600 underline-offset-4 hover:text-bone-200 hover:underline"
          >
            Alla våra länkar
          </Link>
          <p className="text-xs text-bone-700">
            © {new Date().getFullYear()} Trasig men hel. Alla rättigheter reserverade.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
