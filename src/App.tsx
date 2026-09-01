import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Links from "./pages/Links";
import Head from "@/components/Head";

const queryClient = new QueryClient();

// Component to handle route-specific meta tags
const RouteHead = () => {
  const location = useLocation();

  const getMetaData = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: "Trasig men Hel - En podcast om läkning och personlig utveckling",
          description: "Lyssna på Trasig men Hel, en podcast där vi utforskar resan från trasighet till helhet. Berättelser om personlig utveckling, mentalt välmående och vägen till självacceptans.",
          url: "https://trasigmenhel.se/"
        };
      case '/lankar':
        return {
          title: "Länkar | Trasig men Hel",
          description: "Alla kanaler för podden Trasig men Hel på ett ställe - Spotify, Apple Podcasts, Instagram, TikTok och mer.",
          url: "https://trasigmenhel.se/lankar"
        };
      default:
        return {
          title: "404 - Sidan hittades inte | Trasig men Hel",
          description: "Den här sidan kunde inte hittas. Gå tillbaka till startsidan för att lyssna på våra senaste avsnitt."
        };
    }
  };

  return <Head {...getMetaData()} />;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteHead />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lankar" element={<Links />} />
            {/* Convenience alias so an English-typed URL still lands right. */}
            <Route path="/links" element={<Navigate to="/lankar" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
