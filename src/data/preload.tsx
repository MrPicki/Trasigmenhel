import React, { createContext, useContext } from 'react';

/**
 * What the page already knows before any JavaScript runs.
 *
 * Every page on this site is written to disk as finished HTML at build time
 * (see scripts/prerender-routes.mjs). The same build inlines the data that
 * HTML was rendered from, so when React takes over it starts from the episode
 * list it is already showing instead of blanking to a skeleton and fetching
 * it again. A crawler that runs no JavaScript sees the text; a visitor sees
 * no flash.
 */

export interface TranscriptSegment {
  /** Seconds from the start of the episode. */
  start: number;
  text: string;
}

export interface Transcript {
  slug: string;
  /** When the transcript was produced, so a re-run can be dated. */
  generatedAt: string;
  /** How it was produced — stated on the page, never passed off as hand-typed. */
  source: string;
  segments: TranscriptSegment[];
}

export interface PreloadData {
  /** Raw entries exactly as they appear in public/episodes.json. */
  episodes?: unknown[];
  feed?: { title?: string; description?: string; image?: string; link?: string } | null;
  /** Only on an episode page, and only for the episode that page is about. */
  transcript?: Transcript | null;
}

declare global {
  interface Window {
    __PRELOAD__?: PreloadData;
  }
}

const PreloadContext = createContext<PreloadData>({});

export const PreloadProvider = ({
  value,
  children,
}: {
  value: PreloadData;
  children: React.ReactNode;
}) => <PreloadContext.Provider value={value}>{children}</PreloadContext.Provider>;

export const usePreload = () => useContext(PreloadContext);

/** What the browser was handed inline, if anything. */
export const preloadFromWindow = (): PreloadData =>
  (typeof window !== 'undefined' && window.__PRELOAD__) || {};
