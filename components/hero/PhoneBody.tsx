/** Landscape iPhone body around the `.frame-rect` screen: titanium edge, black bezel, buttons. */
export default function PhoneBody({ className = '' }: { className?: string }) {
  return (
    <div className={`frame-rect phone-body ${className}`} aria-hidden>
      <div className="frame" />
      {/* Landscape: volume + action buttons on the top edge, side button on the bottom edge */}
      <span className="btn-nub left-[16%] top-[calc(clamp(7px,1vw,13px)*-1-5px)] w-[4%]" />
      <span className="btn-nub left-[23%] top-[calc(clamp(7px,1vw,13px)*-1-5px)] w-[7%]" />
      <span className="btn-nub left-[32%] top-[calc(clamp(7px,1vw,13px)*-1-5px)] w-[7%]" />
      <span className="btn-nub bottom-[calc(clamp(7px,1vw,13px)*-1-5px)] left-[26%] w-[10%]" />
    </div>
  );
}
