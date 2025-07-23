const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl font-medium tracking-tight mb-4">
              <span className="text-primary-foreground">Elite</span>
              <span className="text-gold ml-1">Advisor</span>
            </div>
            <p className="font-body text-sm font-light text-primary-foreground/80 leading-relaxed">
              Providing exceptional luxury real estate services throughout the Washington DC metropolitan area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-body text-sm font-medium text-primary-foreground mb-4 tracking-wide">
              Quick Links
            </h3>
            <nav className="space-y-2">
              <a href="#home" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                Home
              </a>
              <a href="#about" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                About
              </a>
              <a href="#properties" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                Properties
              </a>
              <a href="#insights" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                Insights
              </a>
              <a href="#contact" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                Contact
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-body text-sm font-medium text-primary-foreground mb-4 tracking-wide">
              Contact
            </h3>
            <div className="space-y-2">
              <p className="font-body text-sm font-light text-primary-foreground/80">
                (202) 555-0123
              </p>
              <p className="font-body text-sm font-light text-primary-foreground/80">
                alexandra@eliteadvisor.com
              </p>
              <p className="font-body text-sm font-light text-primary-foreground/80">
                2100 M Street NW, Suite 300<br />
                Washington, DC 20037
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-body text-xs font-light text-primary-foreground/60">
            © 2023 Elite Advisor. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="font-body text-xs font-light text-primary-foreground/60 hover:text-gold transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-xs font-light text-primary-foreground/60 hover:text-gold transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;