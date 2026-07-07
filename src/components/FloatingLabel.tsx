type Props = {
  name: string;
  color?: string; // color del punto de estado
  blinking?: boolean;
};

/** Etiqueta flotante estilo "nametag" sobre personajes y módulos. */
export default function FloatingLabel({ name, color = "#7ee787", blinking }: Props) {
  return (
    <div className="flex items-center gap-1 bg-black/80 border border-white/20 px-1.5 py-0.5 whitespace-nowrap">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${blinking ? "anim-blink" : ""}`}
        style={{ backgroundColor: color }}
      />
      <span className="text-[8px] leading-none text-white font-pixel tracking-wide">
        {name}
      </span>
    </div>
  );
}
