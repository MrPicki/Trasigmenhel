import React from 'react';

const FALLBACK_DESCRIPTION =
  '"Trasig men hel" är en ärlig och osminkad podcast om att bryta negativa mönster och hitta styrka i sårbarheten. Värden Christoffer "Picki" delar sin resa från en tuff uppväxt präglad av trauma och missbruk till en pappa som kämpar för förändring. Genom personliga berättelser och gästintervjuer utforskar vi hur vi kan växa genom livets utmaningar.';

interface AboutSectionProps {
  description?: string | null;
}

/**
 * The record's front matter: who is speaking, and on what terms. Field labels
 * on the left, the text on the right — the same two-column grammar the
 * register uses, so the page reads as one document.
 */
const AboutSection = ({ description }: AboutSectionProps) => {
  const text = description && description.length > 0 ? description : FALLBACK_DESCRIPTION;

  return (
    <section className="bg-paper text-ink" aria-labelledby="om-podden">
      <div className="shell">
        <div className="border-t border-ink py-5">
          <h2 id="om-podden" className="text-2xl tracking-tight sm:text-3xl">
            Om podden
          </h2>
        </div>

        <div className="grid gap-x-8 gap-y-10 border-t border-paper-400 py-10 sm:grid-cols-[5.5rem_1fr] sm:py-14">
          <div className="label pt-1.5 text-paper-600">Beskrivning</div>

          <div className="min-w-0">
            <p
              className="max-w-[34ch] text-ink"
              style={{ fontSize: 'clamp(1.5rem, 4.6vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.06 }}
            >
              Från en uppväxt präglad av trauma och missbruk — till en pappa som kämpar för förändring.
            </p>

            <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-9">
              <img
                src="/lovable-uploads/podcast-cover.jpg"
                alt="Omslaget till Trasig men hel"
                loading="lazy"
                width={160}
                height={160}
                className="h-36 w-36 flex-shrink-0 object-cover sm:h-40 sm:w-40"
              />
              <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-paper-700 sm:text-base">
                {text}
              </p>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-y-6 border-t border-paper-400 py-8 sm:grid-cols-4">
          {[
            ['Värd', 'Christoffer "Picki"'],
            ['Utgivning', 'Varannan vecka'],
            ['Språk', 'Svenska'],
            ['Produktion', 'Ncom'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="label text-paper-600">{label}</dt>
              <dd className="mt-1.5 text-[0.9375rem] font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default AboutSection;
