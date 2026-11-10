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
 * Brevo använder samma adress som avsändare. Den synkas automatiskt från
 * GitHub Actions via scripts/sync-welcome-template.mjs.
 */
export const CONTACT_EMAIL = 'mail@trasigmenhel.se';

/**
 * De två destinationer sajten faktiskt jobbar för. De ligger också i LINKS
 * nedan (länksidan visar alla kanaler), men startsidans huvudåtgärder pekar
 * hit direkt så att adressen bara finns på ett ställe.
 */
export const SPOTIFY_URL =
  'https://open.spotify.com/show/2N8p98KRnDw3OVsIwm6ArQ?si=c068c24b58c64c4f';
export const APPLE_URL = 'https://podcasts.apple.com/se/podcast/trasig-men-hel/id6807401829';

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
    href: SPOTIFY_URL,
    note: 'Alla avsnitt, gratis',
    icon: SpotifyIcon,
    primary: true,
  },
  {
    label: 'Apple Podcasts',
    href: APPLE_URL,
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
    // Sidan har numera ett claimat användarnamn, så den gamla numeriska
    // profile.php-adressen är ersatt av det här.
    label: 'Facebook',
    href: 'https://www.facebook.com/Trasigmenhel',
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
 * Google Search Console säger vad folk faktiskt söker på när de hittar
 * sajten — utan den gissar vi. Lägg till domänen på
 * search.google.com/search-console, välj verifiering med HTML-tagg, och
 * klistra in enbart innehållet i `content="..."` här. Tom sträng = ingen tagg.
 */
export const GOOGLE_SITE_VERIFICATION = '';

export interface EpisodePage {
  /**
   * The URL segment: trasigmenhel.se/avsnitt/<slug>.
   *
   * Once an episode has been published and shared, its slug is permanent.
   * Changing it breaks every link anyone has posted and throws away whatever
   * ranking the page has earned. Add a new entry; never edit a live slug.
   */
  slug: string;
  /**
   * The title the site shows, when the feed's own title does not say what the
   * episode is about. "Avsnitt 1 Del 2" is invisible in search — nobody types
   * it. Write what the episode actually covers, in the words a listener would
   * use, and mirror the same title in Spotify for Creators.
   */
  title?: string;
  /** The <meta description>, about 150 characters. Falls back to the feed text. */
  summary?: string;
}

/**
 * One entry per published episode, keyed by its id in the RSS feed.
 *
 * An episode with no entry still gets a page — the slug is then derived from
 * its feed title, which works but moves if the title is ever edited. Writing
 * the entry pins it.
 */
export const EPISODE_PAGES: Record<string, EpisodePage> = {
  'df713108-0af4-4e76-a502-169017d989f7': {
    slug: 'samtalet-med-mamma-del-1',
    title: 'Samtalet med mamma, del 1: en uppväxt vi minns olika',
    summary:
      'Christoffer och hans mamma går tillbaka till minnen och sår från en uppväxt som format dem båda — men som de inte minns på samma sätt. Del 1 av 3.',
  },
  'ef5bd475-4fd8-49a2-932a-26b47fae2a28': {
    slug: 'samtalet-med-mamma-del-2',
    title: 'Samtalet med mamma, del 2: när två versioner av samma barndom krockar',
    summary:
      'Tonen hårdnar och murarna går upp. Två versioner av samma barndom krockar, och avståndet känns större än åren som gått. Del 2 av 3.',
  },
  'ae668d51-4a80-4348-a43a-8a9496f67464': {
    slug: 'samtalet-med-mamma-del-3',
    title: 'Samtalet med mamma, del 3: att söka ett erkännande som aldrig kommer',
    summary:
      'Christoffer söker svar, ansvar och ett erkännande av skadan han bär på — och lämnas utan. Den tredje och sista delen av samtalet.',
  },
  '8e086765-ed89-4f3a-85f9-4c116c6c4d04': {
    slug: 'reflektioner-efter-samtalet-med-mamma',
    title: 'Bonus: vad händer när ett vuxet barn konfronterar sin förälder',
    summary:
      'Efter samtalet med mamma — om trauma, skuld, förlåtelse, och om läkning kan handla om att förstå att svaren aldrig kommer.',
  },
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
