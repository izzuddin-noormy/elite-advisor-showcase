import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitch from '@/components/LanguageSwitch';
import ThemeSwitch from '@/components/ThemeSwitch';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.properties'), href: '/properties' },
    { name: t('nav.insights'), href: '#insights' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="font-serif text-2xl font-medium tracking-tight">
            <span className="text-primary">Mu</span>
            <span className="text-gold ml-1">SiChen</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-body text-sm font-light tracking-wide text-foreground/80 hover:text-foreground transition-colors duration-300 elegant-underline"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Theme Switch, Language Switch & Contact Button */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitch />
            <LanguageSwitch />
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-primary transition-all duration-300 font-body text-sm font-light tracking-wide"
            >
              {t('nav.scheduleConsultation')}
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-foreground">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
