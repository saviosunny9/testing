import {
  ArrowRight,
  Baby,
  Bell,
  Cpu,
  DoorOpen,
  House,
  Images,
  KeyRound,
  Lightbulb,
  Lock,
  MessagesSquare,
  Moon,
  PawPrint,
  ScanFace,
  ShieldCheck,
  Speaker,
  Sun,
  Thermometer,
  User,
  Activity,
  Heart,
} from 'lucide-react';
import { Wordmark } from '@/components/Header';
import AppMark from '@/components/hero/AppMark';
import { BRAND_NAME, COPY } from '@/lib/brand';

const ICON = { size: 22, strokeWidth: 1.5 } as const;

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`mono text-[12px] font-medium text-ink-muted ${className}`}>{children}</p>;
}

/* 1. Statement ------------------------------------------------------------- */
export function Statement() {
  return (
    <section className="bg-cream py-24 md:py-36">
      <div className="container-x">
        <p data-reveal className="display h2-section mx-auto max-w-[18ch] text-balance text-center text-ink">
          Made for the people, pets, and places you <span className="accent-serif">love.</span>
        </p>
      </div>
    </section>
  );
}

/* 2. Who it watches over --------------------------------------------------- */
const WHO = [
  { title: 'Kids', line: 'Know they got home, and catch the giggles you would have missed.', img: '/media/stills/kids.jpg', icon: Baby },
  { title: 'Pets', line: 'See what Milo gets up to, and talk to him when he whines at the door.', img: '/media/stills/pets.jpg', icon: PawPrint },
  { title: 'Grandparents', line: 'A gentle check-in that respects their independence.', img: '/media/stills/grandparents.jpg', icon: Heart },
];

export function WhoItWatches() {
  return (
    <section id="how-it-works" className="bg-sand py-24 md:py-36">
      <div className="container-x">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow>Who it watches over</Eyebrow>
            <h2 data-reveal className="display h2-section mt-4 text-ink">
              Everyone who makes <span className="accent-serif">home</span> home.
            </h2>
          </div>
          <p data-reveal className="self-end text-ink-muted md:col-span-4 md:col-start-9">
            {BRAND_NAME} recognises the people and pets you add, so alerts read like news from home, not like an alarm.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {WHO.map(({ title, line, img, icon: Icon }) => (
            <article data-reveal key={title} className="group relative aspect-[3/4] overflow-hidden rounded-card bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[var(--warm-shade)]" />
              <span className="glass absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold text-white">
                <Icon size={15} strokeWidth={1.5} /> {title}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="display text-[2rem]">{title}</h3>
                <p className="mt-2 max-w-[30ch] text-[15px] leading-normal text-white/90">{line}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3. Features -------------------------------------------------------------- */
const FEATURES = [
  { icon: ScanFace, title: 'Smart detection', body: 'Tells kids, grown-ups, and pets apart, so you only hear about what matters.' },
  { icon: MessagesSquare, title: 'Two-way talk', body: 'Say goodnight, calm the dog, or remind someone the keys are on the hook.' },
  { icon: Moon, title: 'Night vision', body: 'Clear, colour-true view in low light, without a harsh glow in the room.' },
  { icon: Images, title: 'Moments, auto-saved', body: 'Birthday candles and first steps are clipped and kept, ready to share.' },
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] md:w-[300px]">
      <div
        aria-hidden
        className="absolute -inset-[45%] rounded-full"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(248,178,106,.5), rgba(240,122,46,.12) 50%, transparent 70%)' }}
      />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-[64px] border-[1.5px] border-[rgba(240,122,46,.35)]"
          style={{ inset: -(i + 1) * 34, borderRadius: 56 + (i + 1) * 34 }}
        />
      ))}
      <div className="relative rounded-[48px] bg-ink p-3 shadow-[0_40px_80px_-24px_rgba(80,40,10,.45)]">
        <div className="overflow-hidden rounded-[38px] bg-linen">
          <div className="flex items-center justify-between px-5 pb-2 pt-4 text-[11px] font-semibold text-ink">
            <span>9:41</span>
            <span className="h-5 w-20 rounded-full bg-ink" />
            <span>82%</span>
          </div>
          <div className="px-4 pb-5">
            <div className="flex items-center gap-2 py-2">
              <AppMark size={26} />
              <span className="text-[15px] font-bold tracking-[-0.02em]">Home</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-leaf-soft px-2 py-0.5 text-[10px] font-semibold text-forest">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> All safe
              </span>
            </div>
            <div className="relative mt-1 aspect-video overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/hero-poster.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
              <span className="mono absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[var(--hud-glass)] px-2 py-0.5 text-[8px] text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-rec" /> Live · Cam 01
              </span>
              <span className="absolute left-[30%] top-[8%] h-[84%] w-[52%] rounded-lg border-[1.5px] border-leaf" />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Today</p>
            {[
              { t: 'Kids are home', s: 'Living Room · 3:42 PM', c: 'bg-leaf' },
              { t: 'Milo by the window', s: 'Living Room · 2:10 PM', c: 'bg-peach' },
              { t: 'Moment saved', s: 'Dining · 1:05 PM', c: 'bg-apricot' },
            ].map((e) => (
              <div key={e.t} className="mt-2 flex items-center gap-3 rounded-xl bg-white/70 p-2.5">
                <span className={`h-2 w-2 rounded-full ${e.c}`} />
                <div>
                  <p className="text-[12px] font-semibold leading-tight">{e.t}</p>
                  <p className="text-[10px] text-ink-muted">{e.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="overflow-hidden bg-cream py-24 md:py-36">
      <div className="container-x grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="py-16 md:sticky md:top-[18vh]">
            <PhoneMockup />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Eyebrow>Features</Eyebrow>
          <h2 data-reveal className="display h2-section mt-4 text-ink">
            Small camera, <span className="accent-serif">big heart.</span>
          </h2>
          <ul className="mt-12 divide-y divide-line border-y border-line">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li data-reveal key={title} className="flex gap-5 py-9 md:py-12">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-linen text-forest ring-1 ring-line">
                  <Icon {...ICON} />
                </span>
                <div>
                  <h3 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-ink">{title}</h3>
                  <p className="mt-2 max-w-[42ch] text-ink-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 4. Icon grid ------------------------------------------------------------- */
const GRID = [
  { icon: Thermometer, label: 'Temperature' },
  { icon: Activity, label: 'Motion' },
  { icon: Lightbulb, label: 'Lights' },
  { icon: House, label: 'Home & away' },
  { icon: User, label: 'Familiar faces' },
  { icon: DoorOpen, label: 'Doors' },
  { icon: Lock, label: 'Smart locks' },
  { icon: Speaker, label: 'Speakers' },
  { icon: Sun, label: 'Routines' },
];

export function IconGrid() {
  return (
    <section className="bg-linen py-24 md:py-36">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Eyebrow>Integrations</Eyebrow>
          <h2 data-reveal className="display h2-section mt-4 text-ink">
            Works with your <span className="accent-serif">smart home.</span>
          </h2>
          <p data-reveal className="mt-6 max-w-[40ch] text-ink-muted">
            Turn on the hallway light when the kids get in, or lock the door when everyone&apos;s asleep. {BRAND_NAME} plays
            nicely with the devices you already have.
          </p>
        </div>
        <div className="grid grid-cols-3 overflow-hidden rounded-card border border-line md:col-span-6 md:col-start-7">
          {GRID.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex aspect-square flex-col items-center justify-center gap-3 border-b border-r border-line text-forest [&:nth-child(3n)]:border-r-0 [&:nth-last-child(-n+3)]:border-b-0"
            >
              <Icon size={30} strokeWidth={1.5} />
              <span className="text-center text-[13px] font-medium text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 5. Product --------------------------------------------------------------- */
function CameraPackshot() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(50% 50% at 50% 45%, rgba(248,178,106,.55), rgba(240,122,46,.1) 55%, transparent 72%)' }}
      />
      {/* body */}
      <div className="absolute left-1/2 top-[14%] h-[52%] w-[52%] -translate-x-1/2 rounded-[42%] bg-gradient-to-b from-[#fbc3ad] via-peach to-[#e98f74] shadow-[inset_-18px_-22px_40px_rgba(160,70,40,.25),inset_14px_16px_30px_rgba(255,255,255,.45),0_40px_60px_-24px_rgba(80,40,10,.5)]">
        <div className="absolute left-1/2 top-1/2 grid h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink shadow-[0_0_0_10px_rgba(255,255,255,.35)]">
          <div className="h-[62%] w-[62%] rounded-full bg-[radial-gradient(circle_at_35%_35%,#3a4a5c,#0b0d10_60%)] ring-2 ring-leaf/70" />
          <span className="absolute right-[22%] top-[20%] h-[9%] w-[9%] rounded-full bg-white/70" />
        </div>
        <span className="absolute bottom-[12%] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-leaf shadow-[0_0_8px_var(--leaf)]" />
      </div>
      {/* stand */}
      <div className="absolute left-1/2 top-[64%] h-[12%] w-[8%] -translate-x-1/2 bg-gradient-to-r from-[#e2d6c6] to-[#f6eee2]" />
      <div className="absolute left-1/2 top-[74%] h-[7%] w-[36%] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-[#f8f1e7] to-[#ddd0bf] shadow-[0_24px_30px_-14px_rgba(80,40,10,.45)]" />
    </div>
  );
}

export function Product() {
  return (
    <section id="product" className="bg-sand py-24 md:py-36">
      <div id="plans" className="container-x grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <CameraPackshot />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Eyebrow>The camera</Eyebrow>
          <h2 data-reveal className="display mt-4 flex items-baseline gap-3 text-[clamp(3rem,6vw,6rem)] text-ink">
            {BRAND_NAME} Home
            <span className="h-4 w-4 shrink-0 rounded-full bg-leaf md:h-5 md:w-5" aria-hidden />
          </h2>
          <p data-reveal className="mt-6 max-w-[40ch] text-ink-muted">
            2K HDR, colour night vision, two-way talk, and on-device detection, in a soft-touch shell that looks at home on a
            bookshelf.
          </p>
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-6">
            <p className="text-ink">
              <span className="display text-[2.5rem]">£89</span>
              <span className="ml-2 text-ink-muted">or £7.42/mo</span>
            </p>
            <a href="#" className="pill pill-md focus-ring bg-leaf text-ink hover:bg-[#5bd472]">
              {COPY.hero.primaryCta} <ArrowRight size={18} strokeWidth={1.5} />
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink-muted">
            <li>Free 30-day returns</li>
            <li>2-year warranty</li>
            <li>Peach · Sand · Forest</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 6. Testimonials ---------------------------------------------------------- */
const QUOTES = [
  {
    quote: 'I work late twice a week. Seeing the girls doing homework at the kitchen table, and hearing them shout "hi Mum" through it, makes those evenings so much easier.',
    name: 'Amara Okafor',
    role: 'Mum of two · Bristol',
    img: '/media/stills/portrait-mum.jpg',
  },
  {
    quote: "Dad lives on his own now. He didn't want anything that felt like being watched. This just tells me he's up and about, and it caught his birthday candles too.",
    name: 'Tom Hendry',
    role: 'Son and dad of one · Leeds',
    img: '/media/stills/portrait-dad.jpg',
  },
];

export function Testimonials() {
  return (
    <section id="stories" className="bg-cream py-24 md:py-36">
      <div className="container-x">
        <Eyebrow>Stories</Eyebrow>
        <h2 data-reveal className="display h2-section mt-4 max-w-[16ch] text-ink">
          Families who feel <span className="accent-serif">closer.</span>
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {QUOTES.map((q) => (
            <figure data-reveal key={q.name} className="flex flex-col justify-between gap-10 rounded-card bg-linen p-8 ring-1 ring-line md:p-10">
              <blockquote className="text-[1.375rem] font-medium leading-snug tracking-[-0.02em] text-ink md:text-[1.6rem]">
                “{q.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={q.img} alt="" loading="lazy" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-ink">{q.name}</p>
                  <p className="text-[15px] text-ink-muted">{q.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 7. Privacy --------------------------------------------------------------- */
const PRIVACY = [
  { icon: Cpu, title: 'On-device processing', body: 'Detection runs on the camera. Faces and footage never train anyone’s model.' },
  { icon: KeyRound, title: 'End-to-end encrypted', body: 'Only your family’s phones hold the keys, not us.' },
  { icon: ShieldCheck, title: 'You own your footage', body: 'Download or delete anything, any time. Privacy shutter included.' },
];

export function Privacy() {
  return (
    <section data-header-theme="dark" className="bg-forest py-24 text-white md:py-36">
      <div className="container-x">
        <p className="mono text-[12px] font-medium text-leaf">Privacy</p>
        <h2 data-reveal className="display h2-section mt-4 max-w-[20ch]">
          Your home stays <span className="accent-serif text-leaf">yours.</span>
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {PRIVACY.map(({ icon: Icon, title, body }) => (
            <div data-reveal key={title} className="border-t border-white/15 pt-8">
              <Icon size={28} strokeWidth={1.5} className="text-leaf" />
              <h3 className="mt-6 text-[1.4rem] font-semibold tracking-[-0.03em]">{title}</h3>
              <p className="mt-2 max-w-[34ch] text-white/75">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 8. Closing CTA ----------------------------------------------------------- */
export function ClosingCTA() {
  return (
    <section className="bg-cream py-24 md:py-36">
      <div className="container-x">
        <div data-reveal className="grid overflow-hidden rounded-card md:grid-cols-12">
          <div className="relative min-h-[320px] md:col-span-7 md:min-h-[520px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/stills/storytime.jpg" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-between gap-12 bg-forest p-8 text-white md:col-span-5 md:p-12">
            <Bell size={28} strokeWidth={1.5} className="text-leaf" />
            <div>
              <h2 className="display text-[clamp(2.5rem,4vw,4.5rem)]">
                Home, <span className="accent-serif text-leaf">held close.</span>
              </h2>
              <p className="mt-5 max-w-[34ch] text-white/80">Set up in five minutes. No contract, no drilling, no fuss.</p>
              <a href="#product" className="pill pill-md focus-ring mt-9 bg-leaf text-ink hover:bg-[#5bd472]">
                {COPY.hero.primaryCta} <ArrowRight size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 9. Footer ---------------------------------------------------------------- */
const FOOTER_COLS = [
  { title: 'Product', links: ['The camera', 'Plans', 'Accessories', 'Compare'] },
  { title: 'Company', links: ['About', 'Stories', 'Careers', 'Press'] },
  { title: 'Help', links: ['Setup guide', 'Privacy centre', 'Contact', 'Returns'] },
];

export function Footer() {
  return (
    <footer data-header-theme="dark" className="bg-forest pt-24 text-white">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[1.375rem] font-medium tracking-[-0.02em]">Little moments in your inbox, once a month.</p>
            <form className="mt-6 flex max-w-md gap-2" action="#">
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                required
                placeholder="you@example.com"
                className="focus-ring h-12 min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-5 text-white placeholder:text-white/50"
              />
              <button type="submit" className="pill pill-md focus-ring h-12 bg-leaf text-ink">
                Subscribe
              </button>
            </form>
          </div>
          {FOOTER_COLS.map((c, i) => (
            <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? 'md:col-start-7' : ''}`}>
              <p className="mono text-[12px] text-white/60">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="focus-ring text-white/85 hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-24 flex items-end justify-between gap-6 border-t border-white/15 py-6 text-[14px] text-white/60">
          <span>© 2026 {BRAND_NAME}. Made with care.</span>
          <a href="#" className="focus-ring hover:text-white">
            Privacy policy
          </a>
        </div>
      </div>
      <div className="overflow-hidden" aria-hidden>
        <Wordmark className="block translate-y-[10%] text-center !text-[clamp(8rem,30vw,28rem)] !tracking-[-0.07em] text-white/95" />
      </div>
    </footer>
  );
}
