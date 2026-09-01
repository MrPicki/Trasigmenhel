import {
  SpotifyIcon,
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  type BrandIcon,
} from '@/components/BrandIcons';

/**
 * Everything on this site that changes often lives in this one file:
 * the links, the message on /lankar, and which episode leads the page.
 * Edit here, commit, run `npm run deploy` — no component code needed.
 */

export interface SiteLink {
  /** Shown as the button label. */
  label: string;
  /**
   * The exact destination. Set to `null` for a channel that does not exist
   * yet: the link then disappears everywhere instead of shipping a dead one.
   * A wrong social link is worse than a missing one.
   */
  href: string | null;
  /** One line under the label on /lankar. Keep it short. */
  note?: string;
  icon: BrandIcon;
  /** The one link that gets the filled, inverted treatment. */
  primary?: boolean;
}

/**
 * Order here is the order on the page. Spotify sits first and stays first —
 * every other channel exists to end up there.
 */
export const LINKS: SiteLink[] = [
  {
    label: 'Lyssna på Spotify',
    href: 'https://podcasters.spotify.com/pod/show/trasigmenhel',
    note: 'Alla avsnitt, gratis',
    icon: SpotifyIcon,
    primary: true,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/trasigmenhel.podd',
    note: '@trasigmenhel.podd',
    icon: InstagramIcon,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@trasigmenhel',
    note: '@trasigmenhel',
    icon: TikTokIcon,
  },
  {
    // TODO: paste the exact channel URL, e.g. https://www.youtube.com/@trasigmenhel
    // Until then this row is hidden automatically.
    label: 'YouTube',
    href: null,
    note: 'Avsnitt i videoformat',
    icon: YouTubeIcon,
  },
  {
    // TODO: paste the exact page URL, e.g. https://www.facebook.com/trasigmenhel
    // Until then this row is hidden automatically.
    label: 'Facebook',
    href: null,
    icon: FacebookIcon,
  },
  {
    label: 'Mejla oss',
    href: 'mailto:kontakt@trasigmenhel.se',
    note: 'kontakt@trasigmenhel.se',
    icon: MailIcon,
  },
];

/** Only the links that actually point somewhere. */
export const activeLinks = () =>
  LINKS.filter((link): link is SiteLink & { href: string } => Boolean(link.href));

/**
 * The message at the top of /lankar. Set `enabled` to false to remove it
 * entirely — the page closes the gap on its own.
 */
export const LINKS_MESSAGE = {
  enabled: true,
  /** Two or three lines at most. This is the first thing anyone reads. */
  body: 'Första avsnittet av Trasig men hel ligger uppe nu. Lyssna, och säg efteråt vem du trodde på.',
  /** Optional button under the message. Set to null for no button. */
  action: {
    label: 'Hör hela samtalet',
    href: 'https://podcasters.spotify.com/pod/show/trasigmenhel',
  } as { label: string; href: string } | null,
};

/**
 * Which episodes the site shows, and which one leads.
 *
 * The RSS feed is not guaranteed to arrive newest-first, so the site sorts it
 * by publish date itself rather than trusting the feed's order.
 */
export const EPISODES = {
  /**
   * Episodes whose title matches any of these are never shown publicly.
   * The feed still carries the Anchor test upload; without this it sorts
   * ahead of the premiere and takes over the top of the page.
   * Empty this array to show everything.
   */
  hiddenTitlePatterns: [/^\s*test\b/i, /testavsnitt/i],

  /**
   * Pins the episode that leads the page. Matched against the title first,
   * then the episode's feed id. Set to null to simply lead with the newest.
   */
  featuredMatch: null as string | RegExp | null,
};
