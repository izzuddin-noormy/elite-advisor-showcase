import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
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
      title: "Message Sent",
      description: "Thank you for your inquiry. I'll respond within 24 hours.",
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
              Let's Discuss Your Real Estate Goals
            </h2>
            <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto">
              Whether you're buying, selling, or investing, I'm here to provide the expertise 
              and personalized service you deserve.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-body font-light text-foreground mb-2">
                      Full Name
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
                      Email Address
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
                    Phone Number
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
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="border-border focus:border-gold focus:ring-gold resize-none"
                    placeholder="Tell me about your real estate needs..."
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-light tracking-wide py-3"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-medium text-primary mb-6">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">Office</h4>
                    <p className="font-body text-muted-foreground font-light">
                      2100 M Street NW, Suite 300<br />
                      Washington, DC 20037
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">Phone</h4>
                    <p className="font-body text-muted-foreground font-light">
                      (202) 555-0123
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">Email</h4>
                    <p className="font-body text-muted-foreground font-light">
                      alexandra@eliteadvisor.com
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-body text-sm font-medium text-foreground mb-2">Service Areas</h4>
                    <p className="font-body text-muted-foreground font-light">
                      Washington, DC • Bethesda • Georgetown<br />
                      McLean • Great Falls • Potomac
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-body text-sm font-medium text-foreground mb-4">
                  Schedule a Consultation
                </h4>
                <Button
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-primary font-body font-light tracking-wide"
                >
                  Book Appointment
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