import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  name: string;
  email: string;
}

// Web3Forms is a free form-to-email relay: https://web3forms.com, wired to
// kontakt@trasigmenhel.se. Web3Forms access keys are designed to be public
// (safe in client-side code — see their docs), so it's committed here as
// the default. VITE_WEB3FORMS_KEY can still override it (e.g. a future
// GitHub Actions secret) without a code change.
const WEB3FORMS_ACCESS_KEY =
  (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) || '2af5fb03-1b0a-47dc-9c7d-496b48f95c75';

// Brevo sign-up form endpoint ("Trasig men Hel - Nyhetsbrev"), generated from
// Brevo's own "Simple HTML" embed code. This URL only accepts a new
// subscriber's email into the list (double opt-in required before they're
// actually added) — it carries no secret credential, so it's safe to ship in
// client-side code, same as the Web3Forms key above. This is what actually
// gets a subscriber into the real Brevo list that the automated
// new-episode newsletter (.github/workflows/notify-episode.yml) sends to.
const BREVO_FORM_URL =
  'https://6be33624.sibforms.com/serve/MUIFAKQKICuHSRguppxuD5NX9kEsJaCOF-PPOK5cXRgV9YoPAiKqadqvUl1-ZF5TKFYMO2EMMT1BoS_ZvZ_ICelbGinxgjdQQ6FOT-EmPjgLNWzb4IB5Sp_zgeoCwOgt_4MbJiM1GvcPsEMVpx5S_tMdcRluWpojfOEtCk7RNzGk_9uAhFVXDb4o_t_dxG1bkZY4NbHX1Cd3lh2K';

const NewsletterForm = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Namn krävs';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-post krävs';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ogiltig e-postadress';
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
        EMAIL: formData.email,
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

      // Best-effort notification email to kontakt@trasigmenhel.se so a human
      // sees new sign-ups immediately too. Not critical to the subscription
      // itself, so a failure here doesn't block the success message.
      if (WEB3FORMS_ACCESS_KEY) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: 'Ny prenumerant – Trasig men Hel',
            from_name: 'trasigmenhel.se nyhetsbrev',
            name: formData.name,
            email: formData.email,
          }),
        }).catch(() => {
          // Ignore — this is just a convenience notification, not the subscription itself.
        });
      }

      toast({
        title: 'Nästan klart!',
        description: 'Kolla din inkorg – du får ett mail där du bekräftar din prenumeration.',
      });

      setFormData({ name: '', email: '' });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section className="w-full bg-charcoal-100 py-14 sm:py-20" aria-labelledby="nyhetsbrev">
      <div className="shell">
        <h2 id="nyhetsbrev" className="text-2xl sm:text-3xl text-bone-200">
          Få nya avsnitt i inkorgen
        </h2>
        <p className="mt-3 max-w-prose text-bone-600">
          Ett mejl när ett nytt avsnitt släpps. Inget annat.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="nl-name" className="sr-only">Ditt namn</label>
              <Input
                id="nl-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ditt namn"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'nl-name-error' : undefined}
                className={`h-12 rounded border-charcoal-400 bg-charcoal-200 text-bone-200 placeholder:text-bone-700 ${
                  errors.name ? 'border-destructive' : ''
                }`}
                disabled={isLoading}
              />
              {errors.name && (
                <p id="nl-name-error" className="mt-1.5 text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="nl-email" className="sr-only">Din e-post</label>
              <Input
                id="nl-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
              href="mailto:kontakt@trasigmenhel.se"
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
