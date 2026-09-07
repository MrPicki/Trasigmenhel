import React, { useEffect, useState } from 'react';
import { SpotifyIcon } from './BrandIcons';
import { SPOTIFY_URL } from '@/config/site';

/**
 * The one piece of persistent chrome on the site.
 *
 * The primary action lives in the hero, which a reader leaves behind after
 * one scroll. This slim strip brings it back — nothing but the wordmark and
 * the follow button, on the ink ground, so it reads as the page's own edge
 * rather than a floating widget.
 *
 * It appears only once the hero has actually scrolled out of view, which is
 * measured against a sentinel rather than a magic pixel offset.
 */
const StickyFollow = ({ sentinelId }: { sentinelId: string }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelId]);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 border-b border-ink-600 bg-ink-900/95 backdrop-blur-md transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <div className="shell flex items-center justify-between gap-4 py-2">
        <a
          href="#top"
          tabIndex={visible ? undefined : -1}
          className="truncate text-[0.9375rem] font-bold tracking-[-0.03em] text-paper"
        >
          Trasig men hel
        </a>
        <a
          href={SPOTIFY_URL}
          target="_blank"
          rel="noreferrer"
          tabIndex={visible ? undefined : -1}
          className="inline-flex min-h-[42px] flex-shrink-0 items-center gap-2 bg-paper px-4 text-[0.8125rem] font-semibold tracking-tight text-ink transition-colors hover:bg-paper-100"
        >
          <SpotifyIcon size={16} decorative />
          Följ på Spotify
        </a>
      </div>
    </div>
  );
};

export default StickyFollow;
