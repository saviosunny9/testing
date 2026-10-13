/** Portrait iPhone body around the `.frame-rect` screen: titanium edge, black bezel, side buttons. */
export default function PhoneBody({ className = '' }: { className?: string }) {
  const side = 'calc(var(--ph) * -0.019 - var(--ph) * 0.0105)';
  return (
    <div className={`frame-rect phone-body ${className}`} aria-hidden>
      <div className="frame" />
      {/* action button and volume on the left, side button on the right */}
      <span className="btn-nub top-[17%] h-[3.4%]" style={{ left: side }} />
      <span className="btn-nub top-[23%] h-[6.5%]" style={{ left: side }} />
      <span className="btn-nub top-[31%] h-[6.5%]" style={{ left: side }} />
      <span className="btn-nub top-[25%] h-[10%]" style={{ right: side }} />
    </div>
  );
}
