import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface EpisodeRowProps {
  title: string;
  description: string;
  imageUrl?: string;
  duration: string;
  date: string;
  isActive?: boolean;
  onPlay?: () => void;
}

/**
 * One episode as a row on a hairline, not a card in a grid. With a handful
 * of episodes a list reads as an archive; a four-column card grid reads as
 * an empty template waiting to be filled.
 */
const EpisodeRow = ({
  title,
  description,
  imageUrl,
  duration,
  date,
  isActive = false,
  onPlay,
}: EpisodeRowProps) => {
  // Feed thumbnails occasionally 404. Falling back to the plain block keeps
  // the row's rhythm instead of dropping a broken-image glyph into it.
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
  <li className="border-t border-charcoal-400 first:border-t-0">
    <button
      type="button"
      onClick={onPlay}
      aria-pressed={isActive}
      className="row-hover group flex w-full items-start gap-4 py-5 text-left hover:bg-charcoal-300/40 focus-visible:bg-charcoal-300/40 sm:gap-5 sm:py-6 sm:px-3 sm:-mx-3 rounded"
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-16 w-16 flex-shrink-0 rounded object-cover bg-charcoal-300 sm:h-20 sm:w-20"
        />
      ) : (
        <div className="h-16 w-16 flex-shrink-0 rounded bg-charcoal-300 sm:h-20 sm:w-20" aria-hidden="true" />
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs text-bone-600 tabular-nums">
          {date}
          {duration ? ` · ${duration}` : ''}
        </p>
        <h3 className="mt-1 font-display text-lg leading-snug text-bone-200 sm:text-xl">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-bone-600">
            {description}
          </p>
        )}
        {isActive && (
          <p className="mt-2.5 inline-flex items-center gap-2 text-xs text-bone-400">
            <span className="h-1.5 w-1.5 rounded-full bg-bone-200" aria-hidden="true" />
            Spelas nu
          </p>
        )}
      </div>

      <span
        className="row-hover mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-charcoal-500 text-bone-400 group-hover:border-bone-400 group-hover:text-bone-200"
        aria-hidden="true"
      >
        {isActive ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
      </span>
    </button>
  </li>
  );
};

export default EpisodeRow;
