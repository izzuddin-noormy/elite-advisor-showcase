'use client';

interface BrandProps {
  size?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center';
  className?: string;
}

const SIZES = {
  sm: { word: 'text-xl', sub: 'text-[0.55rem] tracking-[0.3em] pl-[0.3em] mt-0.5' },
  md: { word: 'text-2xl', sub: 'text-[0.62rem] tracking-[0.32em] pl-[0.32em] mt-1' },
  lg: { word: 'text-3xl md:text-4xl', sub: 'text-[0.7rem] tracking-[0.35em] pl-[0.35em] mt-1.5' },
};

/**
 * Mu SiChen wordmark — pure HTML/CSS (not an image).
 * "Mu" in ivory/white, "SiChen" in gold, with a spaced-caps gold "Estates & Co." lockup below.
 * Designed for dark backgrounds (nav, footer, cinematic header).
 */
const Brand = ({ size = 'md', align = 'start', className = '' }: BrandProps) => {
  const s = SIZES[size];
  return (
    <span className={`inline-flex flex-col leading-none ${align === 'center' ? 'items-center' : 'items-start'} ${className}`}>
      <span className={`font-serif font-medium tracking-tight ${s.word}`}>
        <span className="text-white">Mu</span> <span className="text-gold">SiChen</span>
      </span>
      <span className={`font-serif font-normal text-gold uppercase ${s.sub}`}>Estates &amp; Co.</span>
    </span>
  );
};

export default Brand;
