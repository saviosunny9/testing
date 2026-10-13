const SCENES = [
  { src: '/media/life/lounge.jpg', w: 1070, h: 844, room: 'Living room', where: 'On the side table, facing the sofa', mark: { x: 83, y: 49 }, span: 'md:col-span-2 md:row-span-2' },
  { src: '/media/life/evening.jpg', w: 736, h: 1103, room: 'Reading corner', where: 'Beside the chair, quiet as a lamp', mark: { x: 51, y: 39 }, span: 'md:row-span-2' },
  { src: '/media/life/playroom.jpg', w: 1080, h: 1350, room: 'Playroom', where: 'On the bench, with the whole floor in view', mark: { x: 88.7, y: 15.4 }, span: 'md:row-span-2' },
  { src: '/media/life/kitchen-family.jpg', w: 1024, h: 762, room: 'Kitchen', where: 'On the island, out of little hands’ reach', mark: { x: 84.6, y: 70 }, span: 'md:col-span-2' },
  { src: '/media/life/bedroom.jpg', w: 1600, h: 900, room: 'Bedroom', where: 'On the ottoman, watching story time', mark: { x: 25, y: 44 }, span: 'md:col-span-2' },
];

/** The camera in real rooms, with a marker showing where it sits. */
export default function AtHome() {
  return (
    <section id="at-home" className="section bg-white pt-0">
      <div className="container-x">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="eyebrow">
              At home
            </p>
            <h2 data-reveal className="display h-section mt-3 max-w-[14ch] text-ink">
              Small enough to <span className="hl">go anywhere.</span>
            </h2>
          </div>
          <p data-reveal className="lede max-w-[34ch]">
            Shelf, counter, floor or bookcase. Find the camera in each room.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-4 md:grid-rows-[280px_280px_300px] lg:grid-rows-[320px_320px_340px]">
          {SCENES.map((s) => (
            <figure key={s.src} data-reveal className={`group relative aspect-[16/10] overflow-hidden rounded-[3px] bg-surface md:aspect-auto ${s.span}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                width={s.w}
                height={s.h}
                alt={`${s.room} with an Alaro camera ${s.where.toLowerCase()}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
                style={{ objectPosition: `${s.mark.x}% ${s.mark.y}%` }}
              />
              <span className="pointer-events-none absolute" style={{ left: `${s.mark.x}%`, top: `${s.mark.y}%` }} aria-hidden>
                <span className="absolute -left-4 -top-4 h-8 w-8 animate-ping rounded-full bg-white/50" />
                <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full border-2 border-white bg-fresh shadow" />
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5 pt-14 text-white">
                <p className="text-[17px] font-medium tracking-[-0.03em]">{s.room}</p>
                <p className="text-[13px] text-white/80">{s.where}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
