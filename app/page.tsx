import Hero from '@/components/hero/Hero';
import PageEffects from '@/components/sections/PageEffects';
import {
  ClosingCTA,
  Features,
  Footer,
  IconGrid,
  Privacy,
  Product,
  Statement,
  Testimonials,
  WhoItWatches,
} from '@/components/sections/Sections';

export default function Page() {
  return (
    <>
      <main>
        <div id="hero-wrap">
          <Hero />
        </div>
        <Statement />
        <WhoItWatches />
        <Features />
        <IconGrid />
        <Product />
        <Testimonials />
        <Privacy />
        <ClosingCTA />
      </main>
      <Footer />
      <PageEffects />
    </>
  );
}
