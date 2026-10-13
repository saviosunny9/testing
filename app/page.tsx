import Hero from '@/components/hero/Hero';
import AskAlaro from '@/components/sections/AskAlaro';
import BuiltWithCare from '@/components/sections/BuiltWithCare';
import ChooseWay from '@/components/sections/ChooseWay';
import { ClosingCTA, Footer } from '@/components/sections/Closing';
import Control from '@/components/sections/Control';
import Experience from '@/components/sections/Experience';
import Faq from '@/components/sections/Faq';
import Intelligence from '@/components/sections/Intelligence';
import Moments from '@/components/sections/Moments';
import PageEffects from '@/components/sections/PageEffects';
import Understands from '@/components/sections/Understands';

export default function Page() {
  return (
    <>
      <main>
        <div id="hero-wrap">
          <Hero />
        </div>
        <Moments />
        <Intelligence />
        <Understands />
        <AskAlaro />
        <Control />
        <Experience />
        <ChooseWay />
        <BuiltWithCare />
        <Faq />
        <ClosingCTA />
      </main>
      <Footer />
      <PageEffects />
    </>
  );
}
