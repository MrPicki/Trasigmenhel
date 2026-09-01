import React from 'react';

const FALLBACK_DESCRIPTION =
  '"Trasig men hel" är en ärlig och osminkad podcast om att bryta negativa mönster och hitta styrka i sårbarheten. Värden Christoffer "Picki" delar sin resa från en tuff uppväxt präglad av trauma och missbruk till en pappa som kämpar för förändring. Genom personliga berättelser och gästintervjuer utforskar vi hur vi kan växa genom livets utmaningar.';

interface AboutSectionProps {
  description?: string | null;
}

const AboutSection = ({ description }: AboutSectionProps) => {
  const text = description && description.length > 0 ? description : FALLBACK_DESCRIPTION;

  return (
    <section className="w-full bg-charcoal-100 py-14 sm:py-20" aria-labelledby="om-podden">
      <div className="shell">
        <h2 id="om-podden" className="text-2xl sm:text-3xl text-bone-200">
          Om podden
        </h2>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
          <img
            src="/lovable-uploads/podcast-cover.jpg"
            alt="Omslaget till Trasig men hel"
            loading="lazy"
            className="h-32 w-32 flex-shrink-0 rounded object-cover sm:h-40 sm:w-40"
          />
          <div className="min-w-0">
            <p className="text-base leading-relaxed text-bone-400 sm:text-lg">{text}</p>
            <p className="mt-6 text-sm text-bone-600">
              Nya avsnitt varannan vecka · En Ncom-produktion
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
