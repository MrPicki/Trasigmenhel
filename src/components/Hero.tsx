import React from 'react';
import { ArrowUpRight, Play, Pause } from 'lucide-react';
import Fracture from './Fracture';
import { SpotifyIcon, ApplePodcastsIcon } from './BrandIcons';
import { SPOTIFY_URL, APPLE_URL } from '@/config/site';
import { usePlayer } from '@/player/PlayerProvider';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

interface HeroProps {
  episode: PodcastEpisode | null;
  episodeCount: number;
  isLoading: boolean;
}

/**
 * The first viewport, and the only place the site is loud.
 *
 * The wordmark is live type, not a 126 kB banner screenshot: it sets itself
 * to the viewport, stays sharp on any screen, and can carry the fracture
 * behind it. Underneath it sit the two things the site actually exists to
 * do — Spotify and Apple Podcasts — at full width, above the fold, on a
 * phone. Playing the episode here is the quiet third option.
 */
const Hero = ({ episode, episodeCount, isLoading }: HeroProps) => {
  const { toggle, isPlaying, isCurrent } = usePlayer();
  const playingThis = isCurrent(episode) && isPlaying;

  return (
    <header className="relative overflow-hidden bg-ink">
      <Fracture className="pointer-events-none absolute left-[52%] top-[34%] h-[160%] w-[210%] -translate-x-1/2 -translate-y-1/2 sm:left-[46%] sm:top-[38%] sm:w-[125%]" />

      {/* The record's header strip: where this is, and what is in it. */}
      <div className="relative border-b border-ink-600">
        <div className="shell flex items-center justify-between py-3.5">
          <span className="label text-paper-500">trasigmenhel.se</span>
          <span className="label tnum text-paper-500">
            {isLoading ? '—' : `${String(episodeCount).padStart(2, '0')} avsnitt`}
          </span>
        </div>
      </div>

      <div className="shell stage relative pb-14 pt-14 sm:pb-20 sm:pt-24">
        <h1 className="display text-paper" style={{ fontSize: 'clamp(3.25rem, 16.5vw, 12.5rem)' }}>
          <span className="block">Trasig </span>
          <span className="block">men hel</span>
        </h1>

        <p className="mt-7 max-w-[36ch] text-lg leading-snug text-paper-300 sm:mt-9 sm:text-2xl">
          En ärlig och osminkad podd om att bryta negativa mönster och hitta styrka i sårbarheten.
        </p>

        {/* The two destinations, at the size of the decision they carry. */}
        <div className="mt-10 grid gap-2 sm:mt-12 sm:grid-cols-2">
          <a
            href={SPOTIFY_URL}
            target="_blank"
            rel="noreferrer"
            className="bar bg-paper text-ink hover:bg-paper-100"
          >
            <SpotifyIcon size={24} className="flex-shrink-0" decorative />
            <span className="flex-1 text-lg font-semibold tracking-tight sm:text-xl">Följ på Spotify</span>
            <ArrowUpRight size={20} className="flex-shrink-0 opacity-45" aria-hidden="true" />
          </a>

          <a
            href={APPLE_URL}
            target="_blank"
            rel="noreferrer"
            className="bar border border-ink-500 text-paper hover:border-paper-500 hover:bg-ink-700"
          >
            <ApplePodcastsIcon size={24} className="flex-shrink-0" decorative />
            <span className="flex-1 text-lg font-semibold tracking-tight sm:text-xl">Apple Podcasts</span>
            <ArrowUpRight size={20} className="flex-shrink-0 opacity-45" aria-hidden="true" />
          </a>
        </div>

        {/* Third option: stay here and listen. Deliberately the quiet one. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          {episode && (
            <button
              type="button"
              onClick={() => toggle(episode)}
              className="group inline-flex items-center gap-2.5 text-sm text-paper-300 transition-colors hover:text-paper"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-500 transition-colors group-hover:border-paper">
                {playingThis ? (
                  <Pause size={14} fill="currentColor" strokeWidth={0} />
                ) : (
                  <Play size={14} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                )}
              </span>
              {playingThis ? 'Pausa senaste avsnittet' : 'Eller lyssna direkt här'}
            </button>
          )}
          <span className="hidden h-4 w-px bg-ink-500 sm:block" aria-hidden="true" />
          <span className="label text-paper-500">Nya avsnitt varannan vecka</span>
        </div>
      </div>

      {/* Watched by StickyFollow: once this leaves the top of the viewport,
          the follow strip takes over. */}
      <div id="hero-end" aria-hidden="true" className="h-px w-full" />
    </header>
  );
};

export default Hero;
