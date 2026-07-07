import type { AgentState } from "@/types/agent";
import FloatingLabel from "./FloatingLabel";

type Props = {
  state: AgentState;
  /** Posición en % relativa al mapa. */
  x: number;
  y: number;
};

const STATE_COLOR: Record<AgentState, string> = {
  idle: "#7ee787",
  thinking: "#e0b060",
  running: "#60a5e0",
  error: "#e06060",
  done: "#7ee787",
  disconnected: "#777777",
};

/** Sprite pixel-art de un personaje 12x14 dibujado con rects SVG. */
export function PixelPerson({
  hair,
  skin,
  shirt,
  pants,
}: {
  hair: string;
  skin: string;
  shirt: string;
  pants: string;
}) {
  return (
    <svg viewBox="0 0 12 14" className="w-full h-full pixelated" aria-hidden>
      {/* pelo */}
      <rect x="3" y="0" width="6" height="2" fill={hair} />
      <rect x="2" y="1" width="8" height="2" fill={hair} />
      {/* cara */}
      <rect x="3" y="3" width="6" height="3" fill={skin} />
      {/* ojos */}
      <rect x="4" y="4" width="1" height="1" fill="#222" />
      <rect x="7" y="4" width="1" height="1" fill="#222" />
      {/* cuerpo */}
      <rect x="2" y="6" width="8" height="4" fill={shirt} />
      {/* brazos */}
      <rect x="1" y="7" width="1" height="3" fill={skin} />
      <rect x="10" y="7" width="1" height="3" fill={skin} />
      {/* piernas */}
      <rect x="3" y="10" width="2" height="3" fill={pants} />
      <rect x="7" y="10" width="2" height="3" fill={pants} />
      {/* zapatos */}
      <rect x="3" y="13" width="2" height="1" fill="#333" />
      <rect x="7" y="13" width="2" height="1" fill="#333" />
    </svg>
  );
}

function StateIndicator({ state }: { state: AgentState }) {
  if (state === "thinking") {
    return (
      <div className="flex items-end gap-[2px] bg-white border border-black/40 rounded-sm px-1 py-0.5">
        <span className="anim-think w-1 h-1 bg-gray-700 rounded-full" />
        <span className="anim-think think-dot-2 w-1 h-1 bg-gray-700 rounded-full" />
        <span className="anim-think think-dot-3 w-1 h-1 bg-gray-700 rounded-full" />
      </div>
    );
  }
  if (state === "done") {
    return (
      <span className="anim-pop text-crt-green text-[10px] font-bold leading-none bg-black/70 px-1 py-0.5 border border-crt-green">
        ✓
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="anim-error text-crt-red text-[10px] font-bold leading-none bg-black/70 px-1 py-0.5 border border-crt-red">
        !
      </span>
    );
  }
  return null;
}

/** Jarvis: personaje principal, se mueve entre estaciones según su estado. */
export default function JarvisCharacter({ state, x, y }: Props) {
  const moving = state === "running";
  return (
    <div
      className="absolute character-move z-30 flex flex-col items-center"
      style={{ left: `${x}%`, top: `${y}%`, width: "5.5%" }}
    >
      {/* indicador de estado sobre la cabeza */}
      <div className="h-4 mb-0.5 flex items-end">
        <StateIndicator state={state} />
      </div>
      <FloatingLabel
        name="Jarvis"
        color={STATE_COLOR[state]}
        blinking={state === "running" || state === "thinking"}
      />
      <div className={`w-full aspect-[12/14] mt-0.5 ${moving ? "anim-walk" : "anim-bob"}`}>
        <PixelPerson hair="#e8e8e8" skin="#f0c8a0" shirt="#f5f0e8" pants="#8a7a5a" />
      </div>
    </div>
  );
}
