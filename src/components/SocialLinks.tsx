import React from 'react';
import { Instagram, Mail, Music2 } from 'lucide-react';

// Every entry here is a verified, real destination. Do not add a link
// (Facebook included) until the exact URL has been confirmed — a wrong
// or guessed social link is worse than no link at all.
export const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/trasigmenhel.podd',
    icon: Instagram,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@trasigmenhel',
    icon: Music2,
  },
  {
    label: 'E-post',
    href: 'mailto:kontakt@trasigmenhel.se',
    icon: Mail,
  },
] as const;

interface SocialLinksProps {
  variant?: 'default' | 'compact';
  className?: string;
}

const SocialLinks = ({ variant = 'default', className = '' }: SocialLinksProps) => {
  const size = variant === 'compact' ? 18 : 22;

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
          aria-label={label}
          title={label}
          className="flex items-center justify-center h-10 w-10 rounded-full border border-charcoal-400 text-gray-300 transition-colors hover:text-ember-400 hover:border-ember-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
