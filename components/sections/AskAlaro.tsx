'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LogoMark } from '@/components/Header';
import { BRAND_NAME } from '@/lib/brand';

type Answer = { text: string; moments: { src: string; label: string }[] };

const PROMPTS: Record<string, Answer> = {
  'What happened while I was away?': {
    text: 'A lovely day at home. Here are the moments you might want to see.',
    moments: [
      { src: '/media/stills/kitchen.jpg', label: 'Playtime · 10:42 AM' },
      { src: '/media/stills/milo.jpg', label: 'Milo at the window · 4:08 PM' },
      { src: '/media/stills/birthday.jpg', label: 'Grandpa’s cake · 7:42 PM' },
    ],
  },
  'Did everyone get home?': {
    text: 'Yes, everyone’s home. Zoe and Mum got in at 3:42 PM, and Dad at 6:15 PM.',
    moments: [
      { src: '/media/stills/storytime.jpg', label: 'Zoe and Mum · 3:42 PM' },
      { src: '/media/stills/gamenight.jpg', label: 'Dad and Arlo · 6:15 PM' },
    ],
  },
  'Show me today’s moments': {
    text: 'Four moments were saved today. These three are my favourites.',
    moments: [
      { src: '/media/stills/sofa.jpg', label: 'Giggles · 9:20 AM' },
      { src: '/media/stills/gamenight.jpg', label: 'Game night · 6:40 PM' },
      { src: '/media/stills/birthday.jpg', label: 'Candles · 7:42 PM' },
    ],
  },
};

const QUESTIONS = Object.keys(PROMPTS);

export default function AskAlaro() {
  const [question, setQuestion] = useState(QUESTIONS[0]);
  const [state, setState] = useState<'thinking' | 'answered'>('answered');
  const [draft, setDraft] = useState('');
  const [answerKey, setAnswerKey] = useState(QUESTIONS[0]);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const ask = (q: string) => {
    const match = QUESTIONS.find((k) => k.toLowerCase() === q.trim().toLowerCase()) ?? QUESTIONS[0];
    setQuestion(q.trim() || match);
    setState('thinking');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setQuestion(q.trim() || match);
      setState('answered');
    }, 900);
    setAnswerKey(match);
  };
  const answer = PROMPTS[answerKey];

  return (
    <section id="ask" className="section bg-white">
      <div className="container-x">
        <div className="grid items-center gap-12 rounded-[32px] bg-paper px-6 py-14 md:grid-cols-12 md:gap-10 md:px-14 md:py-20">
          <div className="md:col-span-5">
            <p data-reveal className="eyebrow">
              Ask {BRAND_NAME}
            </p>
            <h2 data-reveal className="display h-section mt-4 text-ink">
              Just ask. <span className="hl">Feel right at home.</span>
            </h2>
            <p data-reveal className="lede mt-6 max-w-[34ch]">
              No scrubbing through hours of video. Ask what happened, and get the moments that matter.
            </p>
            <p data-reveal className="mt-8 text-[14px] text-muted">
              Try asking:
            </p>
            <div data-reveal className="mt-3 flex flex-wrap gap-2">
              {QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className={`focus-ring rounded-full border px-4 py-2 text-[14px] transition-colors ${
                    answerKey === q && state === 'answered'
                      ? 'border-charcoal bg-charcoal text-white'
                      : 'border-line bg-white text-ink hover:border-ink'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div data-reveal className="md:col-span-7">
            <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,.25),0_0_0_1px_rgba(0,0,0,.04)]">
              <div className="flex items-center gap-3 border-b border-[#ececf0] px-5 py-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-white">
                  <LogoMark size={15} />
                </span>
                <span className="text-[15px] font-semibold text-ink">Ask {BRAND_NAME}</span>
                <span className="ml-auto text-[12px] text-muted">Your home, in a conversation</span>
              </div>

              <div className="flex min-h-[340px] flex-col gap-5 px-5 py-6" aria-live="polite">
                <p className="self-end rounded-[18px] rounded-br-[6px] bg-surface px-4 py-2.5 text-[15px] text-ink">{question}</p>
                {state === 'thinking' ? (
                  <div className="flex items-center gap-1.5 px-1" aria-label="Thinking">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-[#c7c7cc]" style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                ) : (
                  <div key={answerKey + question} className="animate-[fadeUp_.5s_ease]">
                    <p className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.08em] text-ink">
                      <LogoMark size={13} /> {BRAND_NAME.toUpperCase()}
                    </p>
                    <p className="mt-2 text-[15px] text-ink-2">{answer.text}</p>
                    <div className={`mt-4 grid gap-2.5 ${answer.moments.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {answer.moments.map((m) => (
                        <figure key={m.label}>
                          <div className="aspect-[4/3] overflow-hidden rounded-[12px] bg-surface">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={m.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                          </div>
                          <figcaption className="mt-1.5 text-[12px] text-muted">{m.label}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <form
                className="flex items-center gap-3 border-t border-[#ececf0] px-5 py-3.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  ask(draft);
                  setDraft('');
                }}
              >
                <label htmlFor="ask-input" className="sr-only">
                  Ask anything about your day
                </label>
                <input
                  id="ask-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask anything about your day…"
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-[#a1a1a6] focus:outline-none"
                />
                <button type="submit" aria-label="Send" className="focus-ring grid h-8 w-8 place-items-center rounded-full bg-charcoal text-white">
                  <ArrowUp size={16} strokeWidth={2} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
