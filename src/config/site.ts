import {
  SpotifyIcon,
  ApplePodcastsIcon,
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

/**
 * Den enda e-postadressen sajten använder — i länkar, formulär och som
 * avsändare för nyhetsbrevet. Ändras den, ändras den här och ingen
 * annanstans i koden.
 *
 * Två ställen ligger utanför repot och måste ändras för hand: mottagaren
 * på Web3Forms-nyckeln, och avsändaren i Brevo.
 */
export const CONTACT_EMAIL = 'mail@trasigmenhel.se';

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
    label: 'Apple Podcasts',
    href: 'https://podcasts.apple.com/se/podcast/trasig-men-hel/id6807401829',
    note: 'Prenumerera',
    icon: ApplePodcastsIcon,
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
    label: 'YouTube',
    href: 'https://www.youtube.com/@Trasigmenhel',
    note: '@Trasigmenhel',
    icon: YouTubeIcon,
  },
  {
    // Facebook pages without a claimed username fall back to this numeric
    // profile.php form. It works, but it reads as a machine address next to
    // the other handles. Claim a username on the page (Settings -> Page name
    // and username) and swap this for https://www.facebook.com/<namn>.
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61567352826893',
    icon: FacebookIcon,
  },
  {
    label: 'Mejla oss',
    href: `mailto:${CONTACT_EMAIL}`,
    note: CONTACT_EMAIL,
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
  /**
   * Optional button under the message. Left off because the Spotify button
   * sits directly below it — turn it on only when the message points
   * somewhere the link list doesn't already go, e.g. a live event or a form:
   *   action: { label: 'Boka biljett', href: 'https://...' }
   */
  action: null as { label: string; href: string } | null,
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
