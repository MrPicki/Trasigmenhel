import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { activeLinks, type SiteLink } from '@/config/site';

interface ChannelListProps {
  /** Give the first link the inverted, filled treatment (used on /lankar). */
  emphasizePrimary?: boolean;
  className?: string;
}

/**
 * Every channel that actually exists, as ruled rows rather than a row of
 * icon bubbles. Links live in src/config/site.ts — a channel with no URL yet
 * is filtered out there, so this never renders a dead destination.
 */
const ChannelList = ({ emphasizePrimary = false, className = '' }: ChannelListProps) => (
  <ul className={`border-t border-ink-600 ${className}`}>
    {activeLinks().map((link: SiteLink & { href: string }) => {
      const { label, href, note, icon: Icon, primary } = link;
      const isMail = href.startsWith('mailto:');
      const filled = emphasizePrimary && primary;

      return (
        <li key={label} className={filled ? '' : 'border-b border-ink-600 last:border-b-0'}>
          <a
            href={href}
            target={isMail ? undefined : '_blank'}
            rel={isMail ? undefined : 'noreferrer'}
            className={
              filled
                ? 'bar bg-paper text-ink hover:bg-paper-100'
                : 'bar text-paper hover:bg-ink-700'
            }
          >
            <Icon size={21} className="flex-shrink-0" decorative />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold leading-tight tracking-tight">{label}</span>
              {note && (
                <span className={`label mt-1 block ${filled ? 'text-paper-700' : 'text-paper-500'}`}>
                  {note}
                </span>
              )}
            </span>
            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className={`flex-shrink-0 ${filled ? 'opacity-45' : 'text-paper-500'}`}
            />
          </a>
        </li>
      );
    })}
  </ul>
);

export default ChannelList;
