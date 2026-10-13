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
      <div className="container-x max-w-[820px]">
        <h2 data-reveal className="display h-section text-center text-ink">
          Questions, answered.
        </h2>
        <div data-reveal className="mt-12 flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="rounded-[20px] bg-surface">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="focus-ring flex w-full items-center gap-4 rounded-[20px] px-6 py-5 text-left"
                >
                  <span className="flex-1 text-[16px] font-medium text-ink">{f.q}</span>
                  <Plus size={18} strokeWidth={1.8} className={`shrink-0 text-ink transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <p className="overflow-hidden px-6 text-[15px] leading-relaxed text-muted">
                    <span className="block pb-6">{f.a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p data-reveal className="mt-10 text-center text-[14px] text-muted">
          Still have questions? Find answers in our{' '}
          <a href="#" className="link">
            help centre
          </a>
          .
        </p>
      </div>
    </section>
  );
}
