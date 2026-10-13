import Hero from '@/components/hero/Hero';
import AskAlaro from '@/components/sections/AskAlaro';
import AtHome from '@/components/sections/AtHome';
import ChooseWay from '@/components/sections/ChooseWay';
import { ClosingCTA, Footer } from '@/components/sections/Closing';
import Control from '@/components/sections/Control';
import Experience from '@/components/sections/Experience';
import Faq from '@/components/sections/Faq';
import HowItWorks from '@/components/sections/HowItWorks';
import Moments from '@/components/sections/Moments';
import PageEffects from '@/components/sections/PageEffects';
import ProductTiles from '@/components/sections/ProductTiles';
import Understands from '@/components/sections/Understands';

export default function Page() {
  return (
    <>
      <main>
        <div id="hero-wrap">
          <Hero />
        </div>
        <Moments />
        <ProductTiles />
        <HowItWorks />
        <AtHome />
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
