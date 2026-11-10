import React, { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

/**
 * Sharing, made one tap instead of three.
 *
 * Most of this site's new listeners will arrive because somebody sent the
 * link to somebody else — in a group chat, in a forum thread about the thing
 * the episode is actually about. On a phone this opens the system share
 * sheet; everywhere else it copies the address, which is what a visitor would
 * otherwise do by hand from the address bar.
 */
const ShareButton = ({ title, url }: { title: string; url: string }) => {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // The sheet was dismissed, or the browser refused it. Fall through to
        // copying rather than leaving the tap with no result.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked (insecure context, denied permission). Nothing
      // useful left to do, and nothing worth interrupting the reader over.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-live="polite"
      className="group inline-flex items-center gap-2.5 text-sm text-paper-300 transition-colors hover:text-paper"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-500 transition-colors group-hover:border-paper">
        {copied ? <Check size={15} /> : <Share2 size={15} />}
      </span>
      {copied ? 'Länken är kopierad' : 'Dela avsnittet'}
    </button>
  );
};

export default ShareButton;
