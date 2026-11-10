import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Index from './pages/Index';
import Links from './pages/Links';
import Episode from './pages/Episode';
import Head from '@/components/Head';
import PlayerBar from '@/components/PlayerBar';
import { PlayerProvider } from '@/player/PlayerProvider';
import { PreloadProvider, preloadFromWindow } from '@/data/preload';

const queryClient = new QueryClient();

/**
 * Page meta for the routes whose component does not set its own. An episode
 * page knows its title, date and description, so it is left alone here.
 */
const RouteHead = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith('/avsnitt/')) return null;

  if (pathname === '/') {
    return (
      <Head
        title="Trasig men Hel - En podcast om läkning och personlig utveckling"
        description="Lyssna på Trasig men Hel, en podcast där vi utforskar resan från trasighet till helhet. Berättelser om personlig utveckling, mentalt välmående och vägen till självacceptans."
        url="https://trasigmenhel.se/"
      />
    );
  }

  if (pathname === '/lankar') {
    return (
      <Head
        title="Länkar | Trasig men Hel"
        description="Alla kanaler för podden Trasig men Hel på ett ställe - Spotify, Apple Podcasts, Instagram, TikTok och mer."
        url="https://trasigmenhel.se/lankar"
      />
    );
  }

  return (
    <Head
      title="404 - Sidan hittades inte | Trasig men Hel"
      description="Den här sidan kunde inte hittas. Gå tillbaka till startsidan för att lyssna på våra senaste avsnitt."
    />
  );
};

/** The routes themselves, with no router around them: the browser mounts
 *  these under a BrowserRouter, the build under a StaticRouter. */
export const AppRoutes = () => (
  <>
    <RouteHead />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/avsnitt/:slug" element={<Episode />} />
      <Route path="/lankar" element={<Links />} />
      {/* Convenience alias so an English-typed URL still lands right. */}
      <Route path="/links" element={<Navigate to="/lankar" replace />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
);

/**
 * Everything that wraps the routes. Shared with the build-time renderer, so
 * a provider added here reaches the prerendered HTML as well as the browser.
 */
export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toasts are a browser-only surface; the build has nothing to show. */}
      {typeof window !== 'undefined' && (
        <>
          <Toaster />
          <Sonner />
        </>
      )}
      {/* The player sits above the router so playback survives navigating
          between the pages. */}
      <PlayerProvider>
        {children}
        <PlayerBar />
      </PlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <HelmetProvider>
    <PreloadProvider value={preloadFromWindow()}>
      <AppShell>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppShell>
    </PreloadProvider>
  </HelmetProvider>
);

export default App;
