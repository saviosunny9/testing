import Hero from '@/components/hero/Hero';
import AppShowcase from '@/components/sections/AppShowcase';
import AskAlaro from '@/components/sections/AskAlaro';
import AtHome from '@/components/sections/AtHome';
import Evening from '@/components/sections/Evening';
import ChooseWay from '@/components/sections/ChooseWay';
import { ClosingCTA, Footer } from '@/components/sections/Closing';
import Control from '@/components/sections/Control';
import Experience from '@/components/sections/Experience';
import Faq from '@/components/sections/Faq';
import Moments from '@/components/sections/Moments';
import PageEffects from '@/components/sections/PageEffects';
import ProductJourney from '@/components/sections/ProductJourney';
import ProductTiles from '@/components/sections/ProductTiles';
import Placement from '@/components/sections/Placement';
import Understands from '@/components/sections/Understands';

export default function Page() {
  return (
    <>
      <main>
        <div id="hero-wrap">
          <Hero />
        </div>
        <ProductJourney />
        <Moments />
        <AppShowcase />
        <ProductTiles />
        <Placement />
        <AtHome />
        <Evening />
        <Understands />
        <AskAlaro />
        <Control />
        <Experience />
        <ChooseWay />
        <Faq />
        <ClosingCTA />
      </main>
      <Footer />
      <PageEffects />
    </>
  );
}
