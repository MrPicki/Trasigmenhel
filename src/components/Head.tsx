import React from 'react';
import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const Head = ({ 
  title = "Trasig men Hel - En podcast om läkning och personlig utveckling",
  description = "Lyssna på Trasig men Hel, en podcast där vi utforskar resan från trasighet till helhet. Varje vecka delar vi berättelser om personlig utveckling, mentalt välmående och vägen till självacceptans.",
  image = "/lovable-uploads/66affaea-122f-4746-a96e-42d56ffbecaa.png",
  url = "https://trasigmenhel.se"
}: HeadProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="keywords" content="podcast, personlig utveckling, mental hälsa, självhjälp, läkning, välmående, självacceptans" />
      <meta name="author" content="Trasig men Hel" />
      <meta name="language" content="sv" />
      
      {/* Favicon */}
      <link rel="icon" href="/webpic.png" type="image/png" />
      <link rel="apple-touch-icon" href="/webpic.png" />
      
      {/* Preload Critical Assets */}
      <link 
        rel="preload" 
        href="/lovable-uploads/66affaea-122f-4746-a96e-42d56ffbecaa.png" 
        as="image" 
      />
      <link 
        rel="preload" 
        href="/typography-texture.png" 
        as="image" 
      />
    </Helmet>
  );
};

export default Head;
