import AppMark from './AppMark';
import { BRAND_NAME, COPY } from '@/lib/brand';

type Toast = (typeof COPY.toasts)[number];

export function NotificationToast({ toast, className = '' }: { toast: Toast; className?: string }) {
  return (
    <div
      className={`toast flex w-[300px] max-w-full items-start gap-3 rounded-2xl bg-linen p-3 pr-4 text-left shadow-[0_18px_40px_-14px_rgba(80,40,10,.4),0_2px_6px_rgba(80,40,10,.08)] ring-1 ring-black/[.04] ${className}`}
    >
      <AppMark />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-[14px] font-semibold leading-tight text-ink">{toast.title}</p>
          <span className="shrink-0 text-[12px] text-ink-muted">{toast.time}</span>
        </div>
        <p className="mt-0.5 truncate text-[13px] leading-snug text-ink-muted">{toast.line}</p>
        <span className="sr-only">{BRAND_NAME} notification</span>
      </div>
    </div>
  );
}

const POSITIONS = [
  'right-[-64px] top-[-34px]', // 1. top-right, outside
  'left-[-120px] top-[42%]', // 2. left middle, outside
  'right-[-88px] bottom-[30%]', // 3. bottom-right
];

/** Desktop toasts placed around the frame edges (§6.6). Mobile shows toast 1 in PreviewCopy instead. */
export default function NotificationToasts({ className = '' }: { className?: string }) {
  return (
    <div className={`frame-rect pointer-events-none hidden md:block ${className}`} aria-hidden>
      {COPY.toasts.map((t, i) => (
        <div key={t.title} className={`toast-slot absolute ${POSITIONS[i]}`}>
          <NotificationToast toast={t} />
        </div>
      ))}
    </div>
  );
}
