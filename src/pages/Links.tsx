import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { LINKS, LINKS_MESSAGE, type SiteLink } from '@/config/site';

const LinkRow = ({ link }: { link: SiteLink & { href: string } }) => {
  const { label, href, note, icon: Icon, primary } = link;
  const isMail = href.startsWith('mailto:');

  return (
    <a
      href={href}
      target={isMail ? undefined : '_blank'}
      rel={isMail ? undefined : 'noreferrer'}
      className={
        primary
          ? 'row-hover group flex min-h-[64px] items-center gap-4 rounded border border-bone-200 bg-bone-200 px-5 py-4 text-charcoal-100 hover:bg-bone-100 active:scale-[0.99]'
          : 'row-hover group flex min-h-[64px] items-center gap-4 rounded border border-charcoal-400 bg-charcoal-300/60 px-5 py-4 text-bone-200 hover:border-bone-600 hover:bg-charcoal-300 active:scale-[0.99]'
      }
    >
      <Icon size={22} className="flex-shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-tight">{label}</span>
        {note && (
          <span className={`mt-0.5 block text-sm leading-tight ${primary ? 'text-charcoal-400' : 'text-bone-600'}`}>
            {note}
          </span>
        )}
      </span>
      <ArrowUpRight
        size={18}
        aria-hidden="true"
        className={`flex-shrink-0 transition-opacity ${primary ? 'opacity-50' : 'opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60'}`}
      />
    </a>
  );
};

/**
 * The link-in-bio page: trasigmenhel.se/lankar
 *
 * Everything on it — the links, their order, and the message at the top —
 * comes from src/config/site.ts, so adding a channel is a one-line change.
 */
const Links = () => {
  const links = LINKS.filter((link): link is SiteLink & { href: string } => Boolean(link.href));

  return (
    <main
      className="flex min-h-screen w-full flex-col items-center bg-charcoal-200 px-5 py-14 sm:py-20"
      style={{ paddingBottom: 'max(3.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="stage w-full max-w-[28rem]">
        <div className="flex flex-col items-center text-center">
          <img
            src="/lovable-uploads/podcast-cover.jpg"
            alt="Omslaget till Trasig men hel"
            className="h-24 w-24 rounded object-cover"
            width={96}
            height={96}
          />
          <h1 className="mt-5 font-display text-3xl leading-tight text-bone-200 sm:text-4xl">
            Trasig men hel
          </h1>
          <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-bone-600">
            En ärlig och osminkad podd om att bryta negativa mönster och hitta styrka i sårbarheten.
          </p>
        </div>

        {LINKS_MESSAGE.enabled && (
          <div className="mt-9 border-t border-charcoal-400 pt-6">
            <p className="text-center font-display text-lg leading-snug text-bone-200 sm:text-xl">
              {LINKS_MESSAGE.body}
            </p>
            {LINKS_MESSAGE.action && (
              <div className="mt-4 flex justify-center">
                <a
                  href={LINKS_MESSAGE.action.href}
                  target="_blank"
                  rel="noreferrer"
                  className="row-hover inline-flex min-h-[44px] items-center gap-1.5 rounded border border-charcoal-500 px-4 text-sm font-medium text-bone-400 hover:border-bone-400 hover:text-bone-200"
                >
                  {LINKS_MESSAGE.action.label}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        )}

        <nav aria-label="Våra kanaler" className="mt-9">
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <LinkRow link={link} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-charcoal-400 pt-6 text-center">
          <Link
            to="/"
            className="row-hover text-sm text-bone-600 underline-offset-4 hover:text-bone-200 hover:underline"
          >
            trasigmenhel.se
          </Link>
          <p className="text-xs text-bone-700">
            © {new Date().getFullYear()} Trasig men hel
          </p>
        </div>
      </div>
    </main>
  );
};

export default Links;
