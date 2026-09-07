import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import EpisodesSection from '@/components/EpisodesSection';
import NewsletterForm from '@/components/NewsletterForm';
import ChannelList from '@/components/ChannelList';
import StickyFollow from '@/components/StickyFollow';
import { usePlayer } from '@/player/PlayerProvider';
import { usePodcastFeed } from '@/hooks/use-podcast-feed';

const Index = () => {
  const { episodes, feedInfo, isLoading, error } = usePodcastFeed();
  const { episode: playing } = usePlayer();

  // The feed arrives sorted newest-first (see use-podcast-feed), so the first
  // entry is what the hero's play control starts.
  const latest = useMemo(() => episodes[0] ?? null, [episodes]);

  return (
    <main
      className="flex min-h-screen flex-col bg-ink"
      // Room for the docked player so it never covers the last row.
      style={playing ? { paddingBottom: '5.5rem' } : undefined}
    >
      <span id="top" aria-hidden="true" />
      <StickyFollow sentinelId="hero-end" />

      <Hero episode={latest} episodeCount={episodes.length} isLoading={isLoading} />

      {/* Ink ends, paper begins. The one hard edge on the page. */}
      <EpisodesSection episodes={episodes} isLoading={isLoading} error={error} />

      <AboutSection description={feedInfo?.description} />

      <NewsletterForm />

      <section className="bg-ink text-paper" aria-labelledby="kanaler">
        <div className="shell pb-16 sm:pb-20">
          <div className="flex items-baseline justify-between border-b border-ink-500 py-5">
            <h2 id="kanaler" className="text-2xl tracking-tight sm:text-3xl">
              Kanaler
            </h2>
            <Link
              to="/lankar"
              className="label text-paper-500 underline underline-offset-4 transition-colors hover:text-paper"
            >
              Alla länkar
            </Link>
          </div>
          <ChannelList className="border-t-0" />
        </div>
      </section>

      <footer className="border-t border-ink-600 bg-ink">
        <div className="shell flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-paper-500">
            © {new Date().getFullYear()} Trasig men hel — en Ncom-produktion
          </p>
          <Link
            to="/lankar"
            className="label text-paper-500 underline underline-offset-4 transition-colors hover:text-paper"
          >
            trasigmenhel.se/lankar
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default Index;
