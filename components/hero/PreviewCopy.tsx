import { COPY } from '@/lib/brand';

/** End-state caption under the phone. */
export default function PreviewCopy({ className = '', as: Tag = 'h2' }: { className?: string; as?: 'h2' | 'p' }) {
  const { eyebrow, headline, sub } = COPY.preview;
  return (
    <div className={`frame-rect pointer-events-none ${className}`}>
      <div className="absolute left-1/2 top-[calc(100%+3.4svh)] flex w-[min(92vw,620px)] -translate-x-1/2 flex-col items-center gap-2.5 text-center">
        <p className="preview-item eyebrow">{eyebrow}</p>
        <Tag className="preview-item display text-[clamp(1.6rem,2.6vw,2.6rem)] text-ink">{headline}</Tag>
        <p className="preview-item lede max-w-[480px] max-md:hidden">{sub}</p>
      </div>
    </div>
  );
}
