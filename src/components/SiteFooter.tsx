import React from 'react';
import { Link } from 'react-router-dom';
import ChannelList from '@/components/ChannelList';

/**
 * The channel list and the footer rule, shared by every page that is not the
 * link-in-bio page. Written once so an added channel reaches the whole site.
 */
const SiteFooter = () => (
  <>
    <section className="bg-ink text-paper" aria-labelledby="kanaler">
      <div className="shell pb-16 sm:pb-20">
        <div className="flex items-baseline justify-between border-b border-ink-500 py-5">
          <h2 id="kanaler" className="text-2xl tracking-tight sm:text-3xl">
            Kanaler
          </h2>
          <Link
            to="/lankar"
            className="label text-paper-500 underline underline-offset-4 transition-colors hover:text-paper"
          >
            Alla länkar
          </Link>
        </div>
        <ChannelList className="border-t-0" />
      </div>
    </section>

    <footer className="border-t border-ink-600 bg-ink">
      <div className="shell flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="label text-paper-500">
          © {new Date().getFullYear()} Trasig men hel — en Ncom-produktion
        </p>
        <Link
          to="/lankar"
          className="label text-paper-500 underline underline-offset-4 transition-colors hover:text-paper"
        >
          trasigmenhel.se/lankar
        </Link>
      </div>
    </footer>
  </>
);

export default SiteFooter;
