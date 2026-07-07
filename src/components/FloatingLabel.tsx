type Props = {
  name: string;
  color?: string; // color del punto LED de estado
  blinking?: boolean;
};

/** Etiqueta flotante estilo "nametag" de videojuego. */
export default function FloatingLabel({ name, color = "#62ff8e", blinking }: Props) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-[3px] whitespace-nowrap rounded-[3px] border border-white/15"
      style={{
        backgroundColor: "var(--label-bg)",
        boxShadow: "0 2px 0 rgba(0,0,0,0.35)",
      }}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${blinking ? "anim-blink" : ""}`}
        style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
      />
      <span className="text-[8px] leading-none text-white tracking-wide">{name}</span>
    </div>
  );
}
