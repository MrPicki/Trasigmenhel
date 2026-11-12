import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { SpotifyIcon, ApplePodcastsIcon } from '@/components/BrandIcons';
import { APPLE_URL, PREVIEW_SECONDS, SPOTIFY_URL } from '@/config/site';
import { usePlayer } from '@/player/PlayerProvider';
import { titleFor } from '@/lib/episodes';

/**
 * Vad som händer när försmaken tar slut.
 *
 * Sajten spelar ett smakprov och lämnar sedan över: uppspelningar här syns
 * inte i poddens siffror, och det är i Spotify och Apple en lyssnare blir en
 * prenumerant. Rutan kommer därför med avsnittets egna adresser, inte
 * poddens startsida — den som just hörde början på del 3 ska kunna fortsätta
 * i del 3.
 *
 * Den säger också rakt ut vad som hände. Ljud som bara tystnar läses som ett
 * fel; "du har hört tjugo sekunder" läses som ett val.
 */
const PreviewGate = () => {
  const { episode, previewEnded, dismissPreview } = usePlayer();

  if (!episode) return null;

  const title = titleFor(episode);
  const spotify = episode.spotifyUrl || SPOTIFY_URL;
  const apple = episode.appleUrl || APPLE_URL;

  return (
    <Dialog open={previewEnded} onOpenChange={(open) => !open && dismissPreview()}>
      <DialogContent className="max-w-md gap-0 border-ink-500 bg-ink p-0 text-paper sm:rounded-none">
        <div className="border-b border-ink-600 px-6 py-3.5">
          <span className="label text-paper-500">Förhandslyssning · {PREVIEW_SECONDS} sekunder</span>
        </div>

        <div className="px-6 pb-6 pt-7">
          <DialogTitle
            className="display text-paper"
            style={{ fontSize: 'clamp(1.75rem, 7vw, 2.5rem)' }}
          >
            Hör resten där du lyssnar
          </DialogTitle>

          <DialogDescription className="mt-4 text-[0.9375rem] leading-relaxed text-paper-300">
            Du har hört början av {title}. Hela avsnittet finns i din poddapp — och lyssnar du
            där syns det i poddens siffror.
          </DialogDescription>

          <div className="mt-7 grid gap-2">
            <a
              href={spotify}
              target="_blank"
              rel="noreferrer"
              className="bar bg-paper text-ink hover:bg-paper-100"
            >
              <SpotifyIcon size={22} className="flex-shrink-0" decorative />
              <span className="flex-1 text-lg font-semibold tracking-tight">Lyssna på Spotify</span>
              <ArrowUpRight size={18} className="flex-shrink-0 opacity-45" aria-hidden="true" />
            </a>

            <a
              href={apple}
              target="_blank"
              rel="noreferrer"
              className="bar border border-ink-500 text-paper hover:border-paper-500 hover:bg-ink-700"
            >
              <ApplePodcastsIcon size={22} className="flex-shrink-0" decorative />
              <span className="flex-1 text-lg font-semibold tracking-tight">Apple Podcasts</span>
              <ArrowUpRight size={18} className="flex-shrink-0 opacity-45" aria-hidden="true" />
            </a>
          </div>

          <button
            type="button"
            onClick={dismissPreview}
            className="label mt-6 text-paper-500 underline underline-offset-4 transition-colors hover:text-paper"
          >
            Stäng och fortsätt läsa
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewGate;
