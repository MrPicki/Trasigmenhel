import React from 'react';

const FALLBACK_DESCRIPTION =
  '"Trasig men hel" är en ärlig och osminkad podcast om att bryta negativa mönster och hitta styrka i sårbarheten. Värden Christoffer "Picki" delar sin resa från en tuff uppväxt präglad av trauma och missbruk till en pappa som kämpar för förändring. Genom personliga berättelser och gästintervjuer utforskar vi hur vi kan växa genom livets utmaningar.';

interface AboutSectionProps {
  description?: string | null;
}

const AboutSection = ({ description }: AboutSectionProps) => {
  const text = description && description.length > 0 ? description : FALLBACK_DESCRIPTION;

  return (
    <section className="w-full bg-charcoal-100 py-14 sm:py-20">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Om podden</h2>
          <p className="text-base sm:text-lg leading-relaxed text-gray-300">
            {text}
          </p>
          <p className="mt-6 text-sm text-gray-500">
            Nya avsnitt varannan vecka · En Ncom-produktion
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
