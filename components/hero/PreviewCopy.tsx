import { COPY } from '@/lib/brand';

/** End-state caption under the phone. */
export default function PreviewCopy({ className = '', as: Tag = 'h2' }: { className?: string; as?: 'h2' | 'p' }) {
  const { eyebrow, headline, sub } = COPY.preview;
  return (
    <div className={`frame-rect pointer-events-none ${className}`}>
      <div className="absolute inset-x-[-10%] top-[calc(100%+44px)] flex flex-col items-center gap-3 text-center md:top-[calc(100%+56px)]">
        <p className="preview-item eyebrow">{eyebrow}</p>
        <Tag className="preview-item display text-[clamp(1.75rem,3.2vw,3rem)] text-ink">{headline}</Tag>
        <p className="preview-item lede max-w-[560px] max-md:text-[15px]">{sub}</p>
      </div>
    </div>
  );
}
