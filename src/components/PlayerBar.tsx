import React from 'react';
import { Play, Pause, RotateCcw, RotateCw, X } from 'lucide-react';
import { usePlayer, formatTime } from '@/player/PlayerProvider';
import { SPOTIFY_URL } from '@/config/site';

/**
 * The docked player: the site's one <audio> element given a face.
 *
 * It exists only after a visitor has pressed play, and from then on it stays
 * at the bottom edge of the viewport while they read the rest of the page —
 * which is the whole reason it is not a block inside the hero.
 *
 * The progress bar is the bar's own top rule. The range input over it is
 * transparent but real, so it is draggable, focusable and announced.
 */
const PlayerBar = () => {
  const { episode, isPlaying, currentTime, duration, failed, toggle, dismiss, seek, nudge } = usePlayer();

  if (!episode) return null;

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 animate-dock border-t border-ink-500 bg-ink-900/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="region"
      aria-label="Spelare"
    >
      {/* Progress: the top rule of the bar, filled from the left. */}
      <div className="relative h-[3px] w-full bg-ink-500">
        <div
          className="h-full bg-paper transition-[width] duration-150 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={1}
          value={Math.min(currentTime, duration || 1)}
          disabled={!duration}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Spola i avsnittet"
          aria-valuetext={`${formatTime(currentTime)} av ${formatTime(duration)}`}
          className="absolute inset-x-0 -top-2 h-6 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-paper [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-paper"
        />
      </div>

      <div className="shell flex items-center gap-3 py-3 sm:gap-5 sm:py-4">
        <button
          type="button"
          onClick={() => toggle(episode)}
          aria-label={isPlaying ? 'Pausa' : 'Spela'}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-paper text-ink transition-colors hover:bg-paper-100 sm:h-12 sm:w-12"
        >
          {isPlaying ? (
            <Pause size={16} fill="currentColor" strokeWidth={0} />
          ) : (
            <Play size={16} fill="currentColor" strokeWidth={0} className="ml-0.5" />
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => nudge(-15)}
            aria-label="Backa 15 sekunder"
            className="hidden h-10 w-10 items-center justify-center text-paper-500 transition-colors hover:text-paper sm:flex"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={() => nudge(15)}
            aria-label="Hoppa fram 15 sekunder"
            className="hidden h-10 w-10 items-center justify-center text-paper-500 transition-colors hover:text-paper sm:flex"
          >
            <RotateCw size={16} />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          {failed ? (
            <p className="text-[0.8125rem] leading-snug text-paper-500 sm:text-sm">
              Ljudet gick inte att spela.{' '}
              <a
                href={SPOTIFY_URL}
                target="_blank"
                rel="noreferrer"
                className="text-paper underline underline-offset-4"
              >
                Lyssna på Spotify
              </a>
            </p>
          ) : (
            <>
              <p className="truncate text-sm font-medium leading-tight text-paper">{episode.title}</p>
              <p className="label tnum mt-1 text-paper-500">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Stäng spelaren"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-paper-500 transition-colors hover:text-paper"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
};

export default PlayerBar;
