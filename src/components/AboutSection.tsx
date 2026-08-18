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
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-shrink-0">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-2xl overflow-hidden ring-2 ring-ember-600/60 shadow-[0_0_50px_-10px_rgba(244,126,37,0.4)]">
              <img
                src="/lovable-uploads/podcast-cover.jpg"
                alt="Trasig men Hel – omslagsbild"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="h-px w-8 bg-ember-500" aria-hidden="true" />
              <h2 className="text-2xl sm:text-3xl font-bold">Om podden</h2>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300">
              {text}
            </p>
            <p className="mt-6 text-sm text-ember-400/90 font-medium">
              Nya avsnitt varannan vecka · En Ncom-produktion
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
