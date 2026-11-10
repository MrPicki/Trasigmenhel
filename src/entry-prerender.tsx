import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, type FilledContext } from 'react-helmet-async';
import { AppRoutes, AppShell } from './App';
import { PreloadProvider, type PreloadData } from './data/preload';
import { episodesFromStatic, type PodcastEpisode } from './hooks/use-podcast-feed';
import { isoDate, pathFor, slugFor, summaryFor, titleFor } from './lib/episodes';

/**
 * The site, rendered to finished HTML at build time.
 *
 * GitHub Pages serves files, not an application, so every route has to exist
 * as a real document before anyone asks for it. This module is built once as
 * an SSR bundle and called by scripts/prerender-routes.mjs for each page.
 * It is the same component tree the browser runs — one source of truth for
 * what a page says, whether a search engine reads it with JavaScript or
 * without.
 */

export interface RenderResult {
  /** The page's markup, to be dropped into #root. */
  html: string;
  /** Title, meta, canonical and JSON-LD, already serialised for <head>. */
  head: string;
}

export const render = (url: string, preload: PreloadData): RenderResult => {
  const helmetContext = {} as FilledContext;

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <PreloadProvider value={preload}>
        <AppShell>
          <StaticRouter location={url}>
            <AppRoutes />
          </StaticRouter>
        </AppShell>
      </PreloadProvider>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;
  const head = [helmet?.title, helmet?.meta, helmet?.link, helmet?.script]
    .map((part) => (part ? part.toString() : ''))
    .filter(Boolean)
    .join('\n    ');

  return { html, head };
};

export interface EpisodeRoute {
  path: string;
  slug: string;
  title: string;
  summary: string;
  published: string;
  episode: PodcastEpisode;
}

/** Every episode page the build should write, in the site's own order. */
export const episodeRoutes = (raw: unknown[]): EpisodeRoute[] =>
  episodesFromStatic(raw as never[]).map((episode) => ({
    path: pathFor(episode),
    slug: slugFor(episode),
    title: titleFor(episode),
    summary: summaryFor(episode),
    published: isoDate(episode.pubDateRaw),
    episode,
  }));
