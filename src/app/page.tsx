import Image from 'next/image';
import Link from 'next/link';
import { ReviewsCarousel } from '@/components/home/reviews-carousel';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6 md:px-[48px] py-[96px]">
        <div className="absolute inset-0 z-0 w-full h-full bg-surface">
          <Image
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=80"
            alt="Hero"
            fill
            className="object-cover object-center opacity-30 mix-blend-multiply"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-6 mt-16">
          <h1 className="font-serif text-5xl md:text-8xl font-light text-primary tracking-tighter text-balance leading-[0.9]">
            Your most beautiful moments, <span className="italic">captured.</span>
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-on-surface-variant max-w-xl text-balance tracking-tight">
            Premium personalized maps, star charts, and jewelry designed for the spaces that matter most.
          </p>
          <div className="mt-8">
            <Link
              href="/collections/all"
              className="inline-flex items-center justify-center bg-primary text-on-primary px-8 py-4 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary transition-colors duration-300"
            >
              Create Your Moment
            </Link>
          </div>
        </div>
      </section>

      {/* Collection Showcases */}
      <section className="py-[96px] px-6 md:px-[48px] max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-32 items-center">

          {/* City Maps */}
          <div className="md:col-span-6 order-2 md:order-1 flex flex-col justify-center md:pr-12">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] font-semibold text-on-surface-variant mb-4">Collection I</span>
            <h2 className="font-serif text-4xl md:text-[80px] leading-[0.9] font-light tracking-tighter text-primary mb-6"><span className="italic">City </span>Maps</h2>
            <p className="font-serif italic text-base text-on-surface-variant mb-8 max-w-md">
              Monochrome precision, tailored to your favorite streets. Minimalist design that honors the coordinates of your journey.
            </p>
            <Link href="/collections/city-maps" className="inline-flex items-center text-primary border-b border-primary/30 pb-1 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:text-secondary hover:border-secondary transition-all w-fit group">
              Explore Maps <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
          <div className="md:col-span-6 order-1 md:order-2 mb-12 md:mb-0 relative group border border-outline-variant p-2 bg-surface-container-lowest">
            <div className="aspect-[4/5] bg-surface-container overflow-hidden relative shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                alt="City Map"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Star Maps */}
          <div className="md:col-span-6 order-3 mb-12 md:mb-0 relative group border border-outline-variant p-2 bg-surface-container-lowest">
            <div className="aspect-[4/5] bg-surface-container overflow-hidden relative shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80"
                alt="Star Map"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
          <div className="md:col-span-6 order-4 flex flex-col justify-center md:pl-12">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] font-semibold text-on-surface-variant mb-4">Collection II</span>
            <h2 className="font-serif text-4xl md:text-[80px] leading-[0.9] font-light tracking-tighter text-primary mb-6"><span className="italic">Star </span>Maps</h2>
            <p className="font-serif italic text-base text-on-surface-variant mb-8 max-w-md">
              Astronomically correct night skies. Capture the stars exactly as they aligned in your defining moment.
            </p>
            <Link href="/collections/star-maps" className="inline-flex items-center text-primary border-b border-primary/30 pb-1 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:text-secondary hover:border-secondary transition-all w-fit group">
              Design Star Map <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The Momenterie Standard */}
      <section className="py-[96px] px-6 md:px-[48px] bg-surface-container-lowest border-y border-outline-variant">
        <div className="max-w-[1280px] mx-auto text-center mb-16">
          <h2 className="font-serif italic text-4xl text-primary mb-6">The Momenterie Standard</h2>
          <div className="w-12 h-[1px] bg-primary/30 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-6 text-secondary shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="font-serif text-xl font-medium text-primary mb-4">Museum-Grade Materials</h3>
            <p className="font-sans text-sm text-on-surface-variant">300 DPI vector rendering on heavyweight archival paper. Crafted to resist fading and endure time.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-6 text-secondary shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" /></svg>
            </div>
            <h3 className="font-serif text-xl font-medium text-primary mb-4">Precise Craftsmanship</h3>
            <p className="font-sans text-sm text-on-surface-variant">Every coordinate and star position is scientifically verified, ensuring complete accuracy for your specific location.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-6 text-secondary shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h3 className="font-serif text-xl font-medium text-primary mb-4">Built for Generations</h3>
            <p className="font-sans text-sm text-on-surface-variant">Curated materials, ethically sourced, built to last generations. We respect the environment we help you celebrate.</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsCarousel />
    </>
  );
}
