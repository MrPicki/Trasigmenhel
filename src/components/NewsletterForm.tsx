import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  name: string;
  email: string;
}

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
      // Store subscriber in localStorage
      const newSubscriber = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        date: new Date().toLocaleDateString('sv-SE')
      };
      
      // Get existing subscribers or initialize empty array
      const existingSubscribersJSON = localStorage.getItem('subscribers');
      const existingSubscribers = existingSubscribersJSON 
        ? JSON.parse(existingSubscribersJSON) 
        : [];
      
      // Add new subscriber
      const updatedSubscribers = [...existingSubscribers, newSubscriber];
      
      // Save to localStorage
      localStorage.setItem('subscribers', JSON.stringify(updatedSubscribers));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Prenumeration bekräftad!",
        description: "Tack för din prenumeration. Du kommer nu få våra senaste avsnitt direkt i din inkorg.",
      });
      
      setFormData({ name: '', email: '' });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Något gick fel",
        description: "Det gick inte att registrera din prenumeration. Försök igen senare.",
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
    <section className="w-full bg-charcoal-100 py-16">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Mail className="h-6 w-6 text-gray-400 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold">
              Få våra senaste avsnitt direkt i inboxen
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center justify-center w-full px-4 sm:px-0">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-0 md:flex md:gap-3 lg:gap-4 flex-1 w-full">
              <div className="flex-1 w-full">
                <Input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ditt namn"
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
                className="w-full md:w-auto h-10 sm:h-12 bg-white text-charcoal-100 hover:bg-gray-200 font-bold disabled:opacity-50 text-sm sm:text-base"
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
              className="border-gray-600 hover:bg-white hover:text-charcoal-100 font-semibold text-sm sm:text-base h-10 sm:h-12 w-full md:w-auto"
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
