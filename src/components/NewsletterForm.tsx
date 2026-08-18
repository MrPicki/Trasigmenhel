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
    <section className="relative w-full bg-charcoal-100 py-16 overflow-hidden">
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(244,126,37,0.12) 0%, rgba(244,126,37,0) 60%)' }}
        aria-hidden="true"
      />
      <div className="container relative">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Mail className="h-6 w-6 text-ember-500 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold">
              Få våra senaste avsnitt direkt i inboxen
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center justify-center w-full px-4 sm:px-0">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-0 md:flex md:gap-3 lg:gap-4 flex-1 w-full" noValidate>
              <div className="flex-1 w-full">
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ditt namn"
                  aria-invalid={!!errors.name}
                  className={`bg-charcoal-200 border-charcoal-400 h-10 sm:h-12 text-sm sm:text-base ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 text-left">{errors.name}</p>
                )}
              </div>
              <div className="flex-1 w-full">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Din e-post"
                  aria-invalid={!!errors.email}
                  className={`bg-charcoal-200 border-charcoal-400 h-10 sm:h-12 text-sm sm:text-base ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 text-left">{errors.email}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto h-10 sm:h-12 bg-ember-500 text-charcoal-100 hover:bg-ember-400 font-bold disabled:opacity-50 text-sm sm:text-base shadow-[0_8px_24px_-8px_rgba(244,126,37,0.5)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  'Prenumerera'
                )}
              </Button>
            </form>

            <Button
              variant="outline"
              size="default"
              className="border-gray-600 hover:bg-ember-500 hover:border-ember-500 hover:text-charcoal-100 font-semibold text-sm sm:text-base h-10 sm:h-12 w-full md:w-auto"
              onClick={() => window.location.href = "mailto:kontakt@trasigmenhel.se"}
            >
              <Mail className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Kontakta oss
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterForm;
