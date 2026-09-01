import React from 'react';
import { activeLinks } from '@/config/site';

interface SocialLinksProps {
  className?: string;
  size?: number;
}

/**
 * Icon row of every channel that actually exists. Links live in
 * src/config/site.ts — a channel with no URL yet is filtered out there,
 * so this never renders a dead destination.
 */
const SocialLinks = ({ className = '', size = 20 }: SocialLinksProps) => (
  <div className={`flex flex-wrap items-center gap-2 ${className}`}>
    {activeLinks().map(({ label, href, icon: Icon }) => {
      const isMail = href.startsWith('mailto:');
      return (
        <a
          key={label}
          href={href}
          target={isMail ? undefined : '_blank'}
          rel={isMail ? undefined : 'noreferrer'}
          aria-label={label}
          title={label}
          className="row-hover flex h-11 w-11 items-center justify-center rounded-full border border-charcoal-400 text-bone-600 hover:border-bone-400 hover:text-bone-200"
        >
          <Icon size={size} />
        </a>
      );
    })}
  </div>
);

export default SocialLinks;
