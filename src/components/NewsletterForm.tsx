import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';
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
    <section className="w-full bg-charcoal-100 py-14 sm:py-20" aria-labelledby="nyhetsbrev">
      <div className="shell">
        <h2 id="nyhetsbrev" className="text-2xl sm:text-3xl text-bone-200">
          Få de senaste avsnitten i inkorgen
        </h2>
        <p className="mt-3 max-w-prose text-bone-600">
          Du får ett välkomstmejl direkt och sedan ett mejl när ett nytt avsnitt släpps. Inget annat.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <div className="max-w-xl">
            <div>
              <label htmlFor="nl-email" className="sr-only">Din e-post</label>
              <Input
                id="nl-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="Din e-post"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'nl-email-error' : undefined}
                className={`h-12 rounded border-charcoal-400 bg-charcoal-200 text-bone-200 placeholder:text-bone-700 ${
                  errors.email ? 'border-destructive' : ''
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p id="nl-email-error" className="mt-1.5 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="nl-consent" className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-bone-500">
                <input
                  id="nl-consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleConsentChange}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'nl-consent-error' : 'nl-consent-help'}
                  className="mt-1 h-4 w-4 rounded border-charcoal-400 accent-bone-200"
                  disabled={isLoading}
                />
                <span>Jag vill få nyhetsbrev från Trasig men Hel. Jag kan avsluta prenumerationen när som helst.</span>
              </label>
              {errors.consent && (
                <p id="nl-consent-error" className="mt-1.5 text-sm text-destructive">{errors.consent}</p>
              )}
              <p id="nl-consent-help" className="mt-2 text-xs leading-5 text-bone-700">
                Prenumerationen hanteras av{' '}
                <a
                  href="https://www.brevo.com/en/legal/privacypolicy/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-bone-400"
                >
                  Brevo
                </a>.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              className="h-12 rounded bg-bone-200 px-6 font-semibold text-charcoal-100 hover:bg-bone-100 disabled:opacity-50 sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Skickar
                </>
              ) : (
                'Prenumerera'
              )}
            </Button>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="row-hover inline-flex h-12 items-center justify-center rounded border border-charcoal-400 px-6 text-sm font-medium text-bone-400 hover:border-bone-400 hover:text-bone-200 sm:w-auto"
            >
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" /> Kontakta oss
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsletterForm;
