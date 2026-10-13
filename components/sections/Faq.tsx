'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { BRAND_NAME, PRICE } from '@/lib/brand';

const FAQS = [
  {
    q: `What exactly is ${BRAND_NAME}?`,
    a: `${BRAND_NAME} is a smart camera that understands what’s happening around your space. It recognises people, pets, objects and activity, so you stay connected to the moments that matter instead of scrolling through footage.`,
  },
  { q: 'Do I need a subscription?', a: `No. Live view, alerts and recognition are free with every ${BRAND_NAME}. An optional plan adds 30 days of cloud history and Ask ${BRAND_NAME} for your whole family.` },
  { q: 'Where is my footage stored?', a: 'On the camera’s encrypted storage by default. If you turn on cloud history, clips are encrypted end to end before they leave your home.' },
  { q: 'Can I try it before I commit?', a: `Yes. Every ${BRAND_NAME} comes with 30-day free returns, no questions asked.` },
  { q: 'What forms of payment do you accept?', a: `UPI, all major credit and debit cards, net banking, and no-cost EMI from ${PRICE}.` },
  { q: 'Does it work for a shop or office?', a: `Yes. ${BRAND_NAME} for Business adds opening and closing summaries, footfall, and access for your staff.` },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section bg-white">
      <div className="container-x grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p data-reveal className="eyebrow">
            Support
          </p>
          <h2 data-reveal className="display h-section mt-5 max-w-[10ch] text-ink">
            Questions, <span className="hl">answered.</span>
          </h2>
        </div>
        <div className="md:col-span-8">
        <div data-reveal className="border-t border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="focus-ring flex w-full items-center gap-5 py-6 text-left"
                >
                  <span className="label w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-[clamp(1.1rem,1.5vw,1.375rem)] font-light tracking-[-0.025em] text-ink">{f.q}</span>
                  <Plus size={18} strokeWidth={1.3} className={`shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <p className="overflow-hidden pl-[3.25rem] pr-10 text-[15px] leading-relaxed text-muted">
                    <span className="block pb-6">{f.a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p data-reveal className="mt-8 text-[14px] text-muted">
          Still have questions? Find answers in our{' '}
          <a href="#" className="link">
            help centre
          </a>
          .
        </p>
        </div>
      </div>
    </section>
  );
}
