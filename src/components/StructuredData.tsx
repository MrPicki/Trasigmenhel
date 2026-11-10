import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Schema.org data, as JSON-LD in the document head.
 *
 * This is how a podcast gets to be more than a blue link: Google reads
 * PodcastSeries and PodcastEpisode and can show the episode with its own
 * play control, date and length directly in the result. It costs nothing at
 * runtime and is the one piece of SEO that is purely declarative — but every
 * field has to match what the page actually says, or it is treated as spam.
 */
const StructuredData = ({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);

export default StructuredData;
