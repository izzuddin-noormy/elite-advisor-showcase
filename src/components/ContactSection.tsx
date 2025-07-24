import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: t('contact.toast.title'),
      description: t('contact.toast.description'),
    });
    
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-primary mb-8">
              {t('contact.title')}
            </h2>
            <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-body font-light text-foreground mb-2">
                      {t('contact.form.name')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-border focus:border-gold focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-body font-light text-foreground mb-2">
                      {t('contact.form.email')}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-border focus:border-gold focus:ring-gold"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-body font-light text-foreground mb-2">
                    {t('contact.form.phone')}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-border focus:border-gold focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-body font-light text-foreground mb-2">
                    {t('contact.form.message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="border-border focus:border-gold focus:ring-gold resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-light tracking-wide py-3"
                >
                  {t('contact.form.submit')}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-medium text-primary mb-6">
                  {t('contact.info.title')}
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">{t('contact.info.office')}</h4>
                    <p className="font-body text-muted-foreground font-light">
                      A-G-03 Marc Service Residence<br />
                      No 3, Jalan Pinang<br />
                      50450 Federal Territory of Kuala Lumpur<br />
                      Malaysia
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">{t('contact.info.phone')}</h4>
                    <p className="font-body text-muted-foreground font-light">
                      +(60) 16-828-0399
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">{t('contact.info.email')}</h4>
                    <p className="font-body text-muted-foreground font-light">
                      musichen@propnex.com.my
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">{t('contact.info.serviceAreas')}</h4>
                    <p className="font-body text-muted-foreground font-light">
                      Malaysia • Singapore • China
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-body text-sm font-medium text-foreground mb-4">
                  {t('contact.info.scheduleConsultation')}
                </h4>
                <Button
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-primary font-body font-light tracking-wide"
                >
                  {t('contact.info.bookAppointment')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
