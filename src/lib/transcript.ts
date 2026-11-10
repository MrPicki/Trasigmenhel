import type { TranscriptSegment } from '@/data/preload';

export interface TranscriptParagraph {
  /** Seconds into the episode where this paragraph starts. */
  start: number;
  text: string;
}

const WORDS_PER_PARAGRAPH = 110;

/**
 * Whisper returns one segment per breath — a few words at a time. Printed
 * raw that is unreadable, and a wall of 9 000 words is no better. Group them
 * into paragraphs that break on a finished sentence near the target length,
 * each keeping the timecode of the line it opens with so a reader can jump
 * the audio to the spot they are reading.
 */
export const toParagraphs = (segments: TranscriptSegment[]): TranscriptParagraph[] => {
  const paragraphs: TranscriptParagraph[] = [];
  let current: TranscriptParagraph | null = null;
  let words = 0;

  for (const segment of segments) {
    const text = segment.text.trim();
    if (!text) continue;

    if (!current) {
      current = { start: segment.start, text };
      words = text.split(/\s+/).length;
      continue;
    }

    current.text += ' ' + text;
    words += text.split(/\s+/).length;

    const endsSentence = /[.!?…]["»']?$/.test(text);
    if (words >= WORDS_PER_PARAGRAPH && endsSentence) {
      paragraphs.push(current);
      current = null;
      words = 0;
    } else if (words >= WORDS_PER_PARAGRAPH * 2) {
      // A stretch with no full stop in sight — break anyway rather than
      // letting one paragraph run for a page.
      paragraphs.push(current);
      current = null;
      words = 0;
    }
  }

  if (current) paragraphs.push(current);
  return paragraphs;
};

export const timecode = (seconds: number) => {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h ? String(m).padStart(2, '0') : String(m);
  return `${h ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
};

/** Plain running text — what a crawler reads and what word counts measure. */
export const transcriptText = (segments: TranscriptSegment[]) =>
  segments.map((segment) => segment.text.trim()).filter(Boolean).join(' ');
