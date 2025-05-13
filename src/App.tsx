import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Head from "@/components/Head";

const queryClient = new QueryClient();

// Component to handle route-specific meta tags
const RouteHead = () => {
  const location = useLocation();
  
  // Define meta data for different routes
  const getMetaData = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: "Trasig men Hel - En podcast om läkning och personlig utveckling",
          description: "Lyssna på Trasig men Hel, en podcast där vi utforskar resan från trasighet till helhet. Varje vecka delar vi berättelser om personlig utveckling, mentalt välmående och vägen till självacceptans."
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
