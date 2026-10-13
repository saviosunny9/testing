/** 32px app tile: forest square with the leaf-green "a" mark. */
export default function AppMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[9px] bg-forest font-sans font-bold leading-none text-leaf"
      style={{ width: size, height: size, fontSize: size * 0.62 }}
      aria-hidden
    >
      <span className="-mt-[0.12em]">a</span>
    </span>
  );
}
