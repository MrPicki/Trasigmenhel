import React from 'react';
import { Link } from 'react-router-dom';
import ChannelList from '@/components/ChannelList';
import { LINKS_MESSAGE } from '@/config/site';
import { usePlayer } from '@/player/PlayerProvider';
import { ArrowUpRight } from 'lucide-react';

/**
 * The link-in-bio page: trasigmenhel.se/lankar
 *
 * Opened from an Instagram or TikTok profile, on a phone, usually in the
 * dark — so it stays on the ink ground the whole way and never switches to
 * paper. Everything on it comes from src/config/site.ts, so adding a channel
 * is a one-line change.
 */
const Links = () => {
  const { episode: playing } = usePlayer();

  return (
  <main
    className="relative flex min-h-screen w-full flex-col overflow-hidden bg-ink"
    style={{ paddingBottom: playing ? '7rem' : 'max(3rem, env(safe-area-inset-bottom))' }}
  >
    <div className="shell stage relative w-full max-w-[34rem] pt-14 sm:pt-20">
      <div className="text-center">
        <img
          src="/lovable-uploads/podcast-cover.jpg"
          alt="Omslaget till Trasig men hel"
          className="mx-auto h-24 w-24 object-cover"
          width={96}
          height={96}
        />
        <h1
          className="display mt-6 text-paper"
          style={{ fontSize: 'clamp(2.5rem, 13vw, 4rem)' }}
        >
          Trasig men hel
        </h1>
        <p className="mx-auto mt-4 max-w-[32ch] text-[0.9375rem] leading-relaxed text-paper-300">
          En ärlig och osminkad podd om att bryta negativa mönster och hitta styrka i sårbarheten.
        </p>
      </div>

      {LINKS_MESSAGE.enabled && (
        <div className="mt-10 border-t border-ink-500 pt-7">
          <p
            className="text-center text-paper"
            style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            {LINKS_MESSAGE.body}
          </p>
          {LINKS_MESSAGE.action && (
            <div className="mt-5 flex justify-center">
              <a
                href={LINKS_MESSAGE.action.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 border border-ink-500 px-5 text-sm font-medium text-paper-300 transition-colors hover:border-paper hover:text-paper"
              >
                {LINKS_MESSAGE.action.label}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      )}

      <nav aria-label="Våra kanaler" className="mt-10">
        <ChannelList emphasizePrimary />
      </nav>

      <div className="mt-10 flex flex-col items-center gap-3 border-t border-ink-600 pt-7 text-center">
        <Link
          to="/"
          className="label text-paper-500 underline underline-offset-4 transition-colors hover:text-paper"
        >
          trasigmenhel.se
        </Link>
        <p className="label text-paper-500">© {new Date().getFullYear()} Trasig men hel</p>
      </div>
    </div>
  </main>
  );
};

export default Links;
