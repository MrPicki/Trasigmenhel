import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { YouTubeIcon } from '@/components/BrandIcons';
import { usePreload, type Clip } from '@/data/preload';

const CHANNEL_URL = 'https://www.youtube.com/@Trasigmenhel';
const SHOWN = 6;

const dateLabel = (published: string) => {
  const time = new Date(published).getTime();
  if (Number.isNaN(time)) return '';
  return new Date(time).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * The clips, pulled from the YouTube channel's own RSS feed.
 *
 * A visitor who found an episode page through a search has just been asked to
 * commit to fifty minutes. A forty-second clip is a far smaller first step,
 * and it is the same material. The thumbnails are YouTube's own and come
 * letterboxed for vertical video — which is invisible here, because the bars
 * are black and so is the page.
 *
 * Nothing is embedded: these are images and links, so no YouTube player is
 * loaded, nothing is cookied, and the section costs the page almost nothing.
 */
const ClipsSection = () => {
  const preload = usePreload();
  const [clips, setClips] = useState<Clip[]>(preload.clips ?? []);

  // Only needed when this page was reached by client-side navigation; the
  // prerendered home page already has the list inline.
  useEffect(() => {
    if (clips.length > 0) return;
    let cancelled = false;

    fetch(`${import.meta.env.BASE_URL}youtube.json`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data?.videos)) setClips(data.videos);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [clips.length]);

  if (clips.length === 0) return null;

  return (
    <section className="bg-ink text-paper" aria-labelledby="klipp">
      <div className="shell py-14 sm:py-20">
        <div className="flex items-baseline justify-between border-b border-ink-500 py-5">
          <h2 id="klipp" className="text-2xl tracking-tight sm:text-3xl">
            Klipp
          </h2>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="label inline-flex items-center gap-2 text-paper-500 underline underline-offset-4 transition-colors hover:text-paper"
          >
            <YouTubeIcon size={15} className="flex-shrink-0" decorative />
            Alla på YouTube
          </a>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6">
          {clips.slice(0, SHOWN).map((clip) => (
            <li key={clip.id}>
              <a href={clip.url} target="_blank" rel="noreferrer" className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-700">
                  <img
                    src={clip.thumbnail}
                    alt=""
                    loading="lazy"
                    width={480}
                    height={360}
                    className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-80"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/80 text-paper transition-colors group-hover:bg-paper group-hover:text-ink"
                  >
                    <Play size={12} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-[0.9375rem] font-semibold leading-snug tracking-tight text-paper-300 transition-colors group-hover:text-paper">
                  {clip.title}
                </p>
                <p className="label tnum mt-1.5 text-paper-500">{dateLabel(clip.published)}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClipsSection;
