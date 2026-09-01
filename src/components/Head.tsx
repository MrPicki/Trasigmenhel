import React from 'react';
import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SITE_URL = 'https://trasigmenhel.se';

/** og:image and canonical must be absolute — relative paths are ignored by
 *  most crawlers, so resolve anything relative against the real domain. */
const absolute = (path: string) =>
  path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

const Head = ({
  title = "Trasig men Hel - En podcast om läkning och personlig utveckling",
  description = "Lyssna på Trasig men Hel, en podcast där vi utforskar resan från trasighet till helhet. Berättelser om personlig utveckling, mentalt välmående och vägen till självacceptans.",
  image = "/lovable-uploads/podcast-cover-og.jpg",
  url = SITE_URL
}: HeadProps) => {
  const canonical = absolute(url);
  const imageUrl = absolute(image);

  return (
    <Helmet>
      <link rel="canonical" href={canonical} />
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      <meta property="og:site_name" content="Trasig men Hel" />
      <meta property="og:locale" content="sv_SE" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="theme-color" content="#0F0F11" />
      <meta name="keywords" content="podcast, personlig utveckling, mental hälsa, självhjälp, läkning, välmående, självacceptans" />
      <meta name="author" content="Trasig men Hel" />
      <meta name="language" content="sv" />
      
      {/* Favicon */}
      <link rel="icon" href="/webpic.png" type="image/png" />
      <link rel="apple-touch-icon" href="/webpic.png" />
      
      {/* Preload Critical Assets */}
      <link
        rel="preload"
        href="/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png"
        as="image"
      />
    </Helmet>
  );
};

export default Head;
