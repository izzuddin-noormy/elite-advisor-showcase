import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/lib/useSettings';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ContactSection = () => {
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ title: t('contact.toast.error'), description: t('contact.toast.errorRequired'), variant: 'destructive' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: t('contact.toast.error'), description: t('contact.toast.errorEmail'), variant: 'destructive' });
      return;
    }
    if (formData.phone && !/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
      toast({ title: t('contact.toast.error'), description: t('contact.toast.errorPhone'), variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_submissions').insert([{
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        message: formData.message.trim(),
      }]);
      if (error) throw error;
      toast({ title: t('contact.toast.title'), description: t('contact.toast.description') });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast({ title: t('contact.toast.error'), description: t('contact.toast.errorSubmit'), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const office = pick(language, settings.office_en, settings.office_zh) || 'A-G-03 Marc Service Residence, No 3, Jalan Pinang, 50450 Kuala Lumpur, Malaysia';
  const phone = settings.phone || '+(60) 16-828-0399';
  const email = settings.email || 'musichen@propnex.com.my';
  const serviceAreas = pick(language, settings.service_areas_en, settings.service_areas_zh) || 'Malaysia • Singapore • China';
  const whatsapp = settings.whatsapp || '60168280399';
  const calendarUrl = settings.calendar_url || '';

  return (
    <section id="contact" className="py-20 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-primary mb-8">{t('contact.title')}</h2>
            <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto">{t('contact.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-body font-light text-foreground mb-2">{t('contact.form.name')}</label>
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="border-border focus:border-gold focus:ring-gold" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-body font-light text-foreground mb-2">{t('contact.form.email')}</label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="border-border focus:border-gold focus:ring-gold" />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-body font-light text-foreground mb-2">{t('contact.form.phone')}</label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="border-border focus:border-gold focus:ring-gold" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-body font-light text-foreground mb-2">{t('contact.form.message')}</label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} required className="border-border focus:border-gold focus:ring-gold resize-none" placeholder={t('contact.form.messagePlaceholder')} />
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-light tracking-wide py-3">
                  {submitting ? '...' : t('contact.form.submit')}
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-medium text-primary mb-6">{t('contact.info.title')}</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">{t('contact.info.office')}</h4>
                    <p className="font-body text-muted-foreground font-light whitespace-pre-line">{office}</p>
                  </div>
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">{t('contact.info.phone')}</h4>
                    <p className="font-body text-muted-foreground font-light">{phone}</p>
                  </div>
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">{t('contact.info.email')}</h4>
                    <p className="font-body text-muted-foreground font-light">{email}</p>
                  </div>
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">{t('contact.info.serviceAreas')}</h4>
                    <p className="font-body text-muted-foreground font-light">{serviceAreas}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-body text-sm font-medium text-foreground mb-4">{t('contact.info.scheduleConsultation')}</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  {calendarUrl && (
                    <Button variant="outline" onClick={() => setIsModalOpen(true)} className="border-gold text-gold hover:bg-gold hover:text-primary font-body font-light tracking-wide">
                      {t('contact.info.bookAppointment')}
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')} className="border-gold text-gold hover:bg-gold hover:text-primary font-body font-light tracking-wide">
                    {t('contact.info.whatsappMe')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && calendarUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="relative bg-background rounded-lg shadow-lg w-full max-w-4xl h-[90vh] md:h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">{t('contact.info.bookAppointment')}</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="h-8 w-8 p-0 hover:bg-secondary"><X className="h-4 w-4" /><span className="sr-only">Close</span></Button>
              </div>
              <div className="flex-1 p-4">
                <iframe src={calendarUrl} className="w-full h-full rounded-md border border-border" title="Book Appointment" frameBorder="0" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactSection;
