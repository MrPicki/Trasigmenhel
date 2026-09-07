import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CONTACT_EMAIL } from '@/config/site';

interface FormData {
  email: string;
  consent: boolean;
}

interface FormErrors {
  email?: string;
  consent?: string;
}

// Brevo sign-up form endpoint ("Trasig men Hel - Nyhetsbrev"), generated from
// Brevo's own "Simple HTML" embed code. This URL only accepts a new
// subscriber's email into the list. It carries no secret credential, so it is
// safe in client-side code. The OPT_IN field from the generated Brevo form is
// required too; omitting it makes the request appear successful without adding
// the contact to the newsletter list.
const BREVO_FORM_URL =
  'https://6be33624.sibforms.com/serve/MUIFAKQKICuHSRguppxuD5NX9kEsJaCOF-PPOK5cXRgV9YoPAiKqadqvUl1-ZF5TKFYMO2EMMT1BoS_ZvZ_ICelbGinxgjdQQ6FOT-EmPjgLNWzb4IB5Sp_zgeoCwOgt_4MbJiM1GvcPsEMVpx5S_tMdcRluWpojfOEtCk7RNzGk_9uAhFVXDb4o_t_dxG1bkZY4NbHX1Cd3lh2K';

/**
 * The page's second dark band, and its last loud moment. Same Brevo request
 * as before — only the surface changed.
 */
const NewsletterForm = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', consent: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-post krävs';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ogiltig e-postadress';
    }

    if (!formData.consent) {
      newErrors.consent = 'Du behöver godkänna nyhetsbrevet för att prenumerera';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Brevo is the real subscriber list: this is what the automated
      // "new episode" newsletter (sent from GitHub Actions) actually reads
      // from. This call is the one that must succeed.
      const brevoBody = new URLSearchParams({
        EMAIL: formData.email.trim().toLowerCase(),
        OPT_IN: '1',
        email_address_check: '', // honeypot field, must stay empty
        locale: 'en',
        html_type: 'simple',
      });

      const brevoResponse = await fetch(BREVO_FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: brevoBody.toString(),
      });

      if (!brevoResponse.ok) {
        throw new Error('Kunde inte registrera prenumerationen hos Brevo');
      }

      const brevoResult = await brevoResponse.json().catch(() => null);
      if (brevoResult && brevoResult.success === false) {
        throw new Error('Kunde inte registrera prenumerationen hos Brevo');
      }

      toast({
        title: 'Klart!',
        description: 'Välkomstmejlet med de senaste avsnitten är på väg till din inkorg.',
      });

      setFormData({ email: '', consent: false });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Något gick fel',
        description: 'Det gick inte att registrera din prenumeration. Försök igen senare eller maila oss direkt.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => ({ ...previous, email: e.target.value }));
    if (errors.email) setErrors((previous) => ({ ...previous, email: undefined }));
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => ({ ...previous, consent: e.target.checked }));
    if (errors.consent) setErrors((previous) => ({ ...previous, consent: undefined }));
  };

  return (
    <section className="bg-ink text-paper" aria-labelledby="nyhetsbrev">
      <div className="shell py-16 sm:py-24">
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-[5.5rem_1fr]">
          <div className="label pt-2 text-paper-500">Nyhetsbrev</div>

          <div className="min-w-0">
            <h2
              id="nyhetsbrev"
              className="max-w-[16ch] text-paper"
              style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', letterSpacing: '-0.04em', lineHeight: 0.94 }}
            >
              Ett mejl när ett nytt avsnitt släpps.
            </h2>
            <p className="mt-5 max-w-[52ch] text-paper-300">
              Du får ett välkomstmejl direkt och sedan ett mejl per avsnitt. Inget annat, ingen
              vidareförsäljning, avsluta när du vill.
            </p>

            <form onSubmit={handleSubmit} className="mt-9 max-w-2xl" noValidate>
              <div className="flex flex-col sm:flex-row">
                <label htmlFor="nl-email" className="sr-only">
                  Din e-post
                </label>
                <input
                  id="nl-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="din@epost.se"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'nl-email-error' : undefined}
                  disabled={isLoading}
                  className={`h-14 min-w-0 flex-1 border bg-ink-700 px-4 text-paper outline-none transition-colors placeholder:text-paper-500 focus:border-paper disabled:opacity-60 sm:h-16 sm:px-5 ${
                    errors.email ? 'border-destructive' : 'border-ink-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 inline-flex h-14 items-center justify-center gap-2 bg-paper px-7 font-semibold tracking-tight text-ink transition-colors hover:bg-paper-100 disabled:opacity-50 sm:mt-0 sm:h-16"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {isLoading ? 'Skickar' : 'Prenumerera'}
                </button>
              </div>

              {errors.email && (
                <p id="nl-email-error" className="mt-2 text-sm text-destructive">
                  {errors.email}
                </p>
              )}

              <label
                htmlFor="nl-consent"
                className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-paper-300"
              >
                <input
                  id="nl-consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleConsentChange}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'nl-consent-error' : 'nl-consent-help'}
                  className="mt-1 h-4 w-4 flex-shrink-0 rounded-none border border-ink-500 accent-paper"
                  disabled={isLoading}
                />
                <span>
                  Jag vill få nyhetsbrev från Trasig men Hel. Jag kan avsluta prenumerationen när som
                  helst.
                </span>
              </label>
              {errors.consent && (
                <p id="nl-consent-error" className="mt-2 text-sm text-destructive">
                  {errors.consent}
                </p>
              )}

              <p id="nl-consent-help" className="mt-4 text-xs leading-5 text-paper-500">
                Prenumerationen hanteras av{' '}
                <a
                  href="https://www.brevo.com/en/legal/privacypolicy/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-paper"
                >
                  Brevo
                </a>
                . Hellre skriva direkt?{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2 hover:text-paper">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterForm;
