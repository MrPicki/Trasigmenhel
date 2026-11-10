import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import Head from '@/components/Head';
import StructuredData from '@/components/StructuredData';
import NewsletterForm from '@/components/NewsletterForm';
import SiteFooter from '@/components/SiteFooter';
import StickyFollow from '@/components/StickyFollow';
import { SpotifyIcon, ApplePodcastsIcon } from '@/components/BrandIcons';
import { APPLE_URL, SPOTIFY_URL } from '@/config/site';
import { usePreload, type Transcript } from '@/data/preload';
import { usePodcastFeed } from '@/hooks/use-podcast-feed';
import { usePlayer } from '@/player/PlayerProvider';
import { findBySlug, isoDate, isoDuration, pathFor, summaryFor, titleFor } from '@/lib/episodes';
import { timecode, toParagraphs, transcriptText } from '@/lib/transcript';

const SITE = 'https://trasigmenhel.se';

/**
 * One episode, with its own URL and its own words on the page.
 *
 * This is the page the site did not have, and the reason nothing but the
 * podcast's own name could ever find it in search. The home page can only
 * ever rank for "trasig men hel"; a transcript ranks for the thing somebody
 * actually typed at two in the morning.
 */
const Episode = () => {
  const { slug = '' } = useParams();
  const preload = usePreload();
  const { episodes, isLoading } = usePodcastFeed();
  const { toggle, seek, isPlaying, isCurrent } = usePlayer();

  const episode = useMemo(() => findBySlug(episodes, slug), [episodes, slug]);
  const index = episode ? episodes.findIndex((item) => item.id === episode.id) : -1;
  const number = index >= 0 ? episodes.length - index : null;
  const playing = isCurrent(episode) && isPlaying;

  // Every episode page links on to the others. A visitor who finished reading
  // has somewhere to go, and a crawler that lands deep can reach the whole
  // register without going back to the front page first.
  const others = useMemo(
    () => episodes.filter((item) => item.id !== episode?.id).slice(0, 6),
    [episodes, episode?.id]
  );

  // The build inlines the transcript for the page it rendered. Arriving here
  // by client-side navigation instead, fetch the same file.
  const [transcript, setTranscript] = useState<Transcript | null>(preload.transcript ?? null);

  useEffect(() => {
    if (transcript?.slug === slug || !slug) return;
    let cancelled = false;

    fetch(`${import.meta.env.BASE_URL}transcripts/${slug}.json`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.segments) setTranscript(data as Transcript);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [slug, transcript?.slug]);

  const paragraphs = useMemo(
    () => (transcript?.segments ? toParagraphs(transcript.segments) : []),
    [transcript]
  );

  const jumpTo = (seconds: number) => {
    if (!episode) return;
    if (!isCurrent(episode)) toggle(episode);
    seek(seconds);
  };

  if (!episode) {
    return (
      <main className="flex min-h-screen flex-col justify-center bg-ink">
        <div className="shell py-24 text-center">
          <h1 className="display text-paper" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}>
            {isLoading ? 'Hämtar avsnittet' : 'Avsnittet finns inte'}
          </h1>
          {!isLoading && (
            <p className="mx-auto mt-6 max-w-[40ch] text-paper-300">
              Länken pekar på ett avsnitt som inte ligger uppe. Alla avsnitt finns i registret på
              startsidan.
            </p>
          )}
          <Link
            to="/"
            className="label mt-8 inline-flex items-center gap-2 text-paper-500 underline underline-offset-4 hover:text-paper"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Till startsidan
          </Link>
        </div>
      </main>
    );
  }

  const title = titleFor(episode);
  const summary = summaryFor(episode);
  const url = `${SITE}${pathFor(episode)}`;
  const published = isoDate(episode.pubDateRaw);
  const minutes = episode.durationSeconds ? `${Math.round(episode.durationSeconds / 60)} min` : null;

  const schema: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'PodcastEpisode',
      '@id': url,
      url,
      name: title,
      description: summary,
      datePublished: published || undefined,
      timeRequired: isoDuration(episode.durationSeconds),
      inLanguage: 'sv-SE',
      image: episode.image || `${SITE}/lovable-uploads/podcast-cover-og.jpg`,
      episodeNumber: number ?? undefined,
      partOfSeries: {
        '@type': 'PodcastSeries',
        name: 'Trasig men Hel',
        url: `${SITE}/`,
        webFeed: 'https://anchor.fm/s/3c8f8270/podcast/rss',
      },
      associatedMedia: episode.audioUrl
        ? {
            '@type': 'AudioObject',
            contentUrl: episode.audioUrl,
            encodingFormat: 'audio/mpeg',
            duration: isoDuration(episode.durationSeconds),
          }
        : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trasig men Hel', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Avsnitt', item: `${SITE}/#avsnitt` },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-ink">
      <Head
        title={`${title} | Trasig men Hel`}
        description={summary}
        url={url}
        image={episode.image || '/lovable-uploads/podcast-cover-og.jpg'}
        type="article"
        publishedTime={published}
      />
      <StructuredData data={schema} />

      <span id="top" aria-hidden="true" />
      <StickyFollow sentinelId="episode-head-end" />

      <header className="bg-ink">
        <div className="border-b border-ink-600">
          <div className="shell flex items-center justify-between py-3.5">
            <Link
              to="/"
              className="label inline-flex items-center gap-2 text-paper-500 transition-colors hover:text-paper"
            >
              <ArrowLeft size={13} aria-hidden="true" /> trasigmenhel.se
            </Link>
            {number !== null && (
              <span className="label tnum text-paper-500">Nr {String(number).padStart(2, '0')}</span>
            )}
          </div>
        </div>

        <div className="shell stage pb-12 pt-10 sm:pb-16 sm:pt-14">
          <div className="label tnum flex flex-wrap items-center gap-x-3 gap-y-1 text-paper-500">
            {published && <time dateTime={published}>{episode.pubDate}</time>}
            {minutes && (
              <>
                <span aria-hidden="true">·</span>
                <span>{minutes}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>Podd</span>
          </div>

          <h1
            className="display mt-4 text-paper"
            style={{ fontSize: 'clamp(2.25rem, 8vw, 5rem)' }}
          >
            {title}
          </h1>

          <div className="mt-9 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => toggle(episode)}
              className="bar bg-paper text-ink hover:bg-paper-100"
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-current"
              >
                {playing ? (
                  <Pause size={13} fill="currentColor" strokeWidth={0} />
                ) : (
                  <Play size={13} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                )}
              </span>
              <span className="flex-1 text-lg font-semibold tracking-tight sm:text-xl">
                {playing ? 'Pausa' : 'Lyssna här'}
              </span>
            </button>

            <a
              href={SPOTIFY_URL}
              target="_blank"
              rel="noreferrer"
              className="bar border border-ink-500 text-paper hover:border-paper-500 hover:bg-ink-700"
            >
              <SpotifyIcon size={22} className="flex-shrink-0" decorative />
              <span className="flex-1 text-lg font-semibold tracking-tight sm:text-xl">Spotify</span>
              <ArrowUpRight size={18} className="flex-shrink-0 opacity-45" aria-hidden="true" />
            </a>

            <a
              href={APPLE_URL}
              target="_blank"
              rel="noreferrer"
              className="bar border border-ink-500 text-paper hover:border-paper-500 hover:bg-ink-700"
            >
              <ApplePodcastsIcon size={22} className="flex-shrink-0" decorative />
              <span className="flex-1 text-lg font-semibold tracking-tight sm:text-xl">Apple</span>
              <ArrowUpRight size={18} className="flex-shrink-0 opacity-45" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div id="episode-head-end" aria-hidden="true" className="h-px w-full" />
      </header>

      <article className="bg-paper text-ink">
        <div className="shell py-12 sm:py-16">
          {episode.description && (
            <section aria-labelledby="om-avsnittet">
              <h2 id="om-avsnittet" className="label text-paper-600">
                Om avsnittet
              </h2>
              <p className="mt-4 max-w-[62ch] whitespace-pre-line text-lg leading-relaxed text-ink">
                {episode.description}
              </p>
            </section>
          )}

          {paragraphs.length > 0 && (
            <section aria-labelledby="transkript" className="mt-14 border-t border-paper-400 pt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id="transkript" className="text-2xl tracking-tight sm:text-3xl">
                  Transkript
                </h2>
                <p className="label tnum text-paper-600">
                  {transcriptText(transcript?.segments ?? []).split(/\s+/).length} ord
                </p>
              </div>

              <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-paper-700">
                Hela avsnittet i text. Transkriberat automatiskt med {transcript?.source} — det kan
                innehålla felhörningar, och ljudet är alltid originalet. Klicka på en tidsstämpel
                för att hoppa dit i avsnittet.
              </p>

              <div className="mt-10 space-y-7">
                {paragraphs.map((paragraph) => (
                  <div
                    key={paragraph.start}
                    className="grid grid-cols-1 gap-1.5 sm:grid-cols-[5.5rem_1fr] sm:gap-8"
                  >
                    <button
                      type="button"
                      onClick={() => jumpTo(paragraph.start)}
                      className="label tnum text-left text-paper-600 transition-colors hover:text-ink sm:pt-1.5"
                      aria-label={`Spela från ${timecode(paragraph.start)}`}
                    >
                      {timecode(paragraph.start)}
                    </button>
                    <p className="max-w-[66ch] text-[1.0625rem] leading-[1.75] text-ink">
                      {paragraph.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <nav aria-labelledby="fler-avsnitt" className="mt-14 border-t border-paper-400 pt-10">
              <h2 id="fler-avsnitt" className="text-2xl tracking-tight sm:text-3xl">
                Fler avsnitt
              </h2>
              <ul className="mt-6">
                {others.map((other) => (
                  <li key={other.id} className="border-b border-paper-400 last:border-b-0">
                    <Link
                      to={pathFor(other)}
                      className="group flex items-baseline justify-between gap-6 py-4 transition-colors hover:text-paper-700"
                    >
                      <span className="min-w-0">
                        <span className="block text-lg font-semibold tracking-tight sm:text-xl">
                          {titleFor(other)}
                        </span>
                        <span className="label tnum mt-1 block text-paper-600">
                          {other.pubDate}
                          {other.durationSeconds
                            ? ` · ${Math.round(other.durationSeconds / 60)} min`
                            : ''}
                        </span>
                      </span>
                      <ArrowRight
                        size={18}
                        aria-hidden="true"
                        className="flex-shrink-0 self-center text-paper-600 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="mt-12 border-t border-paper-400 pt-8">
            <Link
              to="/#avsnitt"
              className="label inline-flex items-center gap-2 text-paper-600 underline underline-offset-4 transition-colors hover:text-ink"
            >
              <ArrowLeft size={13} aria-hidden="true" /> Alla avsnitt
            </Link>
          </div>
        </div>
      </article>

      <NewsletterForm />
      <SiteFooter />
    </main>
  );
};

export default Episode;
