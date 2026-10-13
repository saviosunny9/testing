'use client';

import { useEffect, useState } from 'react';
import { isSoundOn, subscribeSound, toggleSound } from '@/lib/heroSound';

/** Music icon: four small bars that move while the film's music and voiceover are on, and lie flat when off. */
export default function SoundToggle({ className = '' }: { className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(isSoundOn());
    return subscribeSound(setOn);
  }, []);
  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={on}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
      title={on ? 'Sound off' : 'Sound on'}
      className={`sound-toggle focus-ring pointer-events-auto grid h-9 w-9 place-items-center ${className}`}
      data-on={on}
    >
      <span className="sound-bars" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
