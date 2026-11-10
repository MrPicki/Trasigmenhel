import React, { useMemo } from 'react';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import EpisodesSection from '@/components/EpisodesSection';
import ClipsSection from '@/components/ClipsSection';
import NewsletterForm from '@/components/NewsletterForm';
import SiteFooter from '@/components/SiteFooter';
import StickyFollow from '@/components/StickyFollow';
import StructuredData from '@/components/StructuredData';
import { activeLinks } from '@/config/site';
import { isoDate, pathFor, titleFor } from '@/lib/episodes';
import { usePlayer } from '@/player/PlayerProvider';
import { usePodcastFeed } from '@/hooks/use-podcast-feed';

const Index = () => {
  const { episodes, feedInfo, isLoading, error } = usePodcastFeed();
  const { episode: playing } = usePlayer();

  // The feed arrives sorted newest-first (see use-podcast-feed), so the first
  // entry is what the hero's play control starts.
  const latest = useMemo(() => episodes[0] ?? null, [episodes]);

  /**
   * What the podcast is, in the form a search engine reads. The episode list
   * is included so the series result can carry its own entries, and sameAs
   * ties this domain to the profiles that carry the same name — the way
   * Google decides that a Spotify show, a TikTok account and this site are
   * one thing and not three.
   */
  const schema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'PodcastSeries',
      '@id': 'https://trasigmenhel.se/#podcast',
      name: 'Trasig men Hel',
      url: 'https://trasigmenhel.se/',
      description:
        feedInfo?.description ||
        'En ärlig och osminkad podd om att bryta negativa mönster och hitta styrka i sårbarheten.',
      image: 'https://trasigmenhel.se/lovable-uploads/podcast-cover-og.jpg',
      inLanguage: 'sv-SE',
      webFeed: 'https://anchor.fm/s/3c8f8270/podcast/rss',
      publisher: { '@type': 'Organization', name: 'Ncom' },
      sameAs: activeLinks()
        .filter((link) => !link.href.startsWith('mailto:'))
        .map((link) => link.href),
      hasPart: episodes.map((episode) => ({
        '@type': 'PodcastEpisode',
        '@id': `https://trasigmenhel.se${pathFor(episode)}`,
        url: `https://trasigmenhel.se${pathFor(episode)}`,
        name: titleFor(episode),
        datePublished: isoDate(episode.pubDateRaw) || undefined,
      })),
    }),
    [episodes, feedInfo?.description]
  );

  return (
    <main
      className="flex min-h-screen flex-col bg-ink"
      // Room for the docked player so it never covers the last row.
      style={playing ? { paddingBottom: '5.5rem' } : undefined}
    >
      <StructuredData data={schema} />
      <span id="top" aria-hidden="true" />
      <StickyFollow sentinelId="hero-end" />

      <Hero episode={latest} episodeCount={episodes.length} isLoading={isLoading} />

      {/* Ink ends, paper begins. The one hard edge on the page. */}
      <EpisodesSection episodes={episodes} isLoading={isLoading} error={error} />

      <AboutSection description={feedInfo?.description} />

      <ClipsSection />

      <NewsletterForm />

      <SiteFooter />
    </main>
  );
};

export default Index;
