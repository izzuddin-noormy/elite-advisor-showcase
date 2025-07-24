const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/src/assets/hero-dh-1.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <p className="font-body text-sm md:text-base font-light tracking-[0.2em] uppercase mb-6 opacity-90">
            Welcome to
          </p>
          
          <h1 className="hero-text text-white mb-8 leading-none">
            Mu Sichen
          </h1>
          
          <p className="tagline text-white/90 max-w-2xl mx-auto mb-12">
            Real Estate Negotiator & Advisor | Kuala Lumpur, Malaysia
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center">
            <a
              href="#properties"
              className="inline-block px-8 py-3 bg-transparent border border-white/50 text-white hover:bg-white hover:text-primary transition-all duration-300 font-body text-sm font-light tracking-wide"
            >
              View Properties
            </a>
            <a
              href="#contact"
              className="inline-block px-8 py-3 bg-gold text-primary hover:bg-gold-dark transition-all duration-300 font-body text-sm font-light tracking-wide"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
