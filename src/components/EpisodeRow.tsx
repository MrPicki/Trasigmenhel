import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

interface EpisodeRowProps {
  episode: PodcastEpisode;
  /** Position in the register, newest first — printed, not derived from the feed. */
  number: number;
  isCurrent: boolean;
  isPlaying: boolean;
  onToggle: () => void;
}

const durationLabel = (seconds: number) => (seconds ? `${Math.round(seconds / 60)} min` : '—');

/**
 * One episode as an entry in a register: a numbered record with its fields
 * printed above the title, on a rule that runs the full measure.
 *
 * Not a card in a grid. With one published episode a grid reads as an empty
 * template waiting to be filled; a numbered record reads as a register that
 * has been started.
 */
const EpisodeRow = ({ episode, number, isCurrent, isPlaying, onToggle }: EpisodeRowProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const showImage = Boolean(episode.image) && !imageFailed;
  const playing = isCurrent && isPlaying;

  return (
    <li className="border-t border-paper-400">
      <article className="grid grid-cols-[auto_1fr] gap-x-4 py-7 sm:grid-cols-[5.5rem_1fr] sm:gap-x-8 sm:py-10">
        <div className="label pt-1.5 tnum text-paper-600">
          Nr {String(number).padStart(2, '0')}
        </div>

        <div className="min-w-0">
          <div className="label tnum flex flex-wrap items-center gap-x-3 gap-y-1 text-paper-600">
            <span>{episode.pubDate}</span>
            <span aria-hidden="true">·</span>
            <span>{durationLabel(episode.durationSeconds)}</span>
            {playing && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-ink">Spelas nu</span>
              </>
            )}
          </div>

          <h3
            className="mt-2.5 text-ink"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', letterSpacing: '-0.035em', lineHeight: 0.95 }}
          >
            {episode.title}
          </h3>

          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {showImage && (
              <img
                src={episode.image}
                alt=""
                loading="lazy"
                width={128}
                height={128}
                onError={() => setImageFailed(true)}
                className="hidden h-32 w-32 flex-shrink-0 object-cover sm:block"
              />
            )}

            <div className="min-w-0 flex-1">
              {episode.description && (
                <>
                  <p className={`max-w-[66ch] text-[0.9375rem] leading-relaxed text-paper-700 ${expanded ? '' : 'line-clamp-3'}`}>
                    {episode.description}
                  </p>
                  {episode.description.length > 200 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((value) => !value)}
                      aria-expanded={expanded}
                      className="label mt-3 text-paper-600 underline underline-offset-4 transition-colors hover:text-ink"
                    >
                      {expanded ? 'Visa mindre' : 'Läs hela beskrivningen'}
                    </button>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={onToggle}
                aria-label={playing ? `Pausa ${episode.title}` : `Spela ${episode.title}`}
                className={`bar mt-6 max-w-sm gap-3 px-4 sm:min-h-[56px] sm:px-5 ${
                  isCurrent
                    ? 'bg-ink text-paper hover:bg-ink-700'
                    : 'border border-ink text-ink hover:bg-ink hover:text-paper'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-current"
                >
                  {playing ? (
                    <Pause size={12} fill="currentColor" strokeWidth={0} />
                  ) : (
                    <Play size={12} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                  )}
                </span>
                <span className="text-[0.9375rem] font-semibold tracking-tight">
                  {playing ? 'Pausa' : isCurrent ? 'Fortsätt lyssna' : 'Lyssna här'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
};

export default EpisodeRow;
