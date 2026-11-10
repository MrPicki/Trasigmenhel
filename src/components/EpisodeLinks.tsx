import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SpotifyIcon, ApplePodcastsIcon } from '@/components/BrandIcons';
import { APPLE_URL, SPOTIFY_URL } from '@/config/site';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

/**
 * Snabbknappar in i det här avsnittet hos Spotify och Apple.
 *
 * Den som läser om del 2 vill öppna del 2 — inte poddens startsida och sedan
 * leta själv. Apples adresser slås upp automatiskt vid varje hämtning;
 * Spotifys kräver ett API-konto och saknas tills vidare, så den knappen
 * pekar på podden. Därför säger etiketten "Avsnittet på …" bara när länken
 * faktiskt går dit.
 */
const EpisodeLinks = ({
  episode,
  tone = 'paper',
  className = '',
}: {
  episode: PodcastEpisode;
  /** Vilken grund knapparna står på. */
  tone?: 'paper' | 'ink';
  className?: string;
}) => {
  const targets = [
    {
      label: 'Spotify',
      href: episode.spotifyUrl || SPOTIFY_URL,
      exact: Boolean(episode.spotifyUrl),
      Icon: SpotifyIcon,
    },
    {
      label: 'Apple Podcasts',
      href: episode.appleUrl || APPLE_URL,
      exact: Boolean(episode.appleUrl),
      Icon: ApplePodcastsIcon,
    },
  ];

  const styles =
    tone === 'ink'
      ? 'border-ink-500 text-paper-300 hover:border-paper hover:text-paper'
      : 'border-paper-400 text-paper-700 hover:border-ink hover:text-ink';

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {targets.map(({ label, href, exact, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            title={exact ? `Öppna avsnittet på ${label}` : `Öppna podden på ${label}`}
            className={`inline-flex min-h-[40px] items-center gap-2 border px-3.5 transition-colors ${styles}`}
          >
            <Icon size={16} className="flex-shrink-0" decorative />
            <span className="label">{label}</span>
            <ArrowUpRight size={13} aria-hidden="true" className="flex-shrink-0 opacity-50" />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default EpisodeLinks;
