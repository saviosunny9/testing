import { COPY } from '@/lib/brand';
import { NotificationToast } from './NotificationToasts';

/** End-state heading below the frame (§6.6). Mobile also shows toast 1 here. */
export default function PreviewCopy({ className = '', as: Tag = 'h2' }: { className?: string; as?: 'h2' | 'p' }) {
  const { headline, sub } = COPY.preview;
  return (
    <div className={`frame-rect pointer-events-none ${className}`}>
      <div className="absolute inset-x-0 top-[calc(100%+24px)] flex flex-col items-center gap-3 text-center md:top-[calc(100%+30px)] md:flex-row md:items-end md:justify-between md:gap-10 md:text-left">
        <Tag className="preview-item display max-w-[18ch] text-[2rem] text-ink md:max-w-none md:shrink-0 md:text-[clamp(1.75rem,2.6vw,3.4rem)]">
          {headline.lead}
          <span className="accent-serif ml-[0.25em] inline-block whitespace-nowrap">{headline.accent}</span>
        </Tag>
        <p className="preview-item max-w-[440px] text-[15px] leading-normal text-ink-muted md:min-w-0 md:text-[17px]">{sub}</p>
        <div className="preview-item mt-2 md:hidden" aria-hidden>
          <NotificationToast toast={COPY.toasts[0]} />
        </div>
      </div>
    </div>
  );
}
