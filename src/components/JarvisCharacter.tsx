"use client";

import type { AgentState } from "@/types/agent";
import FloatingLabel from "./FloatingLabel";
import { JARVIS_ANIMATIONS } from "@/lib/characterAnimations";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";

type Props = {
  state: AgentState;
  /** Posición en % relativa al mapa. */
  x: number;
  y: number;
  /** true mientras pasea en idle (patrulla de la oficina). */
  walking?: boolean;
};

const STATE_COLOR: Record<AgentState, string> = {
  idle: "#62ff8e",
  thinking: "#f6c85f",
  running: "#60a5e0",
  error: "#ff5c7a",
  done: "#62ff8e",
  disconnected: "#70708a",
};

export type PersonConfig = {
  hair: string;
  skin: string;
  shirt: string;
  pants: string;
  /** Peinado: silueta reconocible desde arriba. */
  hairStyle?: "short" | "einstein" | "spiky" | "cap" | "ponytail" | "afro";
  capColor?: string;
  /** Ropa con personalidad. */
  outfit?: "plain" | "coat" | "vest" | "overalls" | "suit" | "hoodie" | "jersey";
  outfitAccent?: string;
  /** Accesorio identitario. */
  accessory?: "glasses" | "headset" | "tie" | "badge";
  /** Objeto en la mano: cuenta qué está haciendo. */
  hold?: "folder" | "wrench" | "paper" | "tablet" | "ball";
};

/** Sprite pixel-art configurable: peinado + ropa + accesorio + objeto. */
export function PixelPerson({
  hair,
  skin,
  shirt,
  pants,
  hairStyle = "short",
  capColor = "#d87a50",
  outfit = "plain",
  outfitAccent,
  accessory,
  hold,
}: PersonConfig) {
  const accent = outfitAccent ?? shirt;
  return (
    <svg
      viewBox="0 0 12 14"
      className="w-full h-full pixelated"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {/* ===== piernas / zapatos ===== */}
      <rect x="3" y="10" width="2" height="3" fill={outfit === "overalls" ? accent : pants} />
      <rect x="7" y="10" width="2" height="3" fill={outfit === "overalls" ? accent : pants} />
      <rect x="3" y="13" width="2" height="1" fill="#333" />
      <rect x="7" y="13" width="2" height="1" fill="#333" />

      {/* ===== cuerpo ===== */}
      <rect x="2" y="6" width="8" height="4" fill={outfit === "suit" ? accent : shirt} />
      {outfit === "coat" && (
        <>
          <rect x="2" y="6" width="1.2" height="4.8" fill={accent} />
          <rect x="8.8" y="6" width="1.2" height="4.8" fill={accent} />
          <rect x="2" y="10" width="8" height="1" fill={shirt} />
        </>
      )}
      {outfit === "vest" && (
        <>
          <rect x="2" y="6" width="2.2" height="4" fill={accent} />
          <rect x="7.8" y="6" width="2.2" height="4" fill={accent} />
        </>
      )}
      {outfit === "overalls" && (
        <>
          <rect x="4" y="7" width="4" height="3" fill={accent} />
          <rect x="4" y="6" width="1" height="1.4" fill={accent} />
          <rect x="7" y="6" width="1" height="1.4" fill={accent} />
        </>
      )}
      {outfit === "suit" && (
        <>
          <rect x="5" y="6" width="2" height="1.4" fill="#f0f0f4" />
          <rect x="5.6" y="6.8" width="0.9" height="2.6" fill={shirt} />
        </>
      )}
      {outfit === "hoodie" && (
        <>
          <rect x="2.4" y="5.6" width="7.2" height="1" fill={accent} />
          <rect x="5" y="6.6" width="0.5" height="1.6" fill={accent} />
          <rect x="6.5" y="6.6" width="0.5" height="1.6" fill={accent} />
        </>
      )}
      {outfit === "jersey" && (
        <>
          {/* cuello y mangas con franja (trim de selección) */}
          <rect x="4.6" y="6" width="2.8" height="0.7" fill={accent} />
          <rect x="2" y="6" width="1" height="1.2" fill={accent} />
          <rect x="9" y="6" width="1" height="1.2" fill={accent} />
          {/* número 10 en el pecho */}
          <rect x="4.8" y="7.4" width="0.7" height="1.8" fill="#2a4bc4" />
          <rect x="6.1" y="7.4" width="1.2" height="1.8" fill="none" stroke="#2a4bc4" strokeWidth="0.5" />
        </>
      )}

      {/* ===== brazos ===== */}
      <rect x="1" y="7" width="1" height="3" fill={skin} />
      <rect x="10" y="7" width="1" height="3" fill={skin} />

      {/* ===== objeto en mano ===== */}
      {hold === "folder" && (
        <>
          <rect x="10.2" y="7.4" width="2.2" height="1.7" fill="#f6c85f" />
          <rect x="10.2" y="7.4" width="2.2" height="0.4" fill="#d8a83c" />
        </>
      )}
      {hold === "wrench" && (
        <>
          <rect x="10.4" y="6.4" width="0.7" height="3" fill="#9aa2b8" />
          <rect x="9.9" y="6" width="1.7" height="0.8" fill="#9aa2b8" />
          <rect x="10.3" y="6.1" width="0.9" height="0.5" fill="#5a6278" />
        </>
      )}
      {hold === "paper" && (
        <>
          <rect x="10.2" y="7.2" width="1.9" height="2.4" fill="#ffffff" />
          <rect x="10.5" y="7.7" width="1.3" height="0.3" fill="#9aa2b8" />
          <rect x="10.5" y="8.4" width="1.3" height="0.3" fill="#9aa2b8" />
        </>
      )}
      {hold === "tablet" && (
        <>
          <rect x="10.2" y="7.2" width="1.9" height="2.5" fill="#2a2a3a" />
          <rect x="10.5" y="7.5" width="1.3" height="1.6" fill="#66f28a" />
        </>
      )}
      {hold === "ball" && (
        <>
          {/* balón de fútbol junto al pie */}
          <circle cx="11" cy="12.6" r="1.5" fill="#ffffff" stroke="#222" strokeWidth="0.3" />
          <rect x="10.5" y="12.1" width="1" height="1" fill="#222" />
          <rect x="9.8" y="12.9" width="0.6" height="0.6" fill="#222" />
          <rect x="11.6" y="13.1" width="0.6" height="0.6" fill="#222" />
          <rect x="11.4" y="11.4" width="0.6" height="0.6" fill="#222" />
        </>
      )}

      {/* ===== cara ===== */}
      <rect x="3" y="3" width="6" height="3" fill={skin} />
      <rect x="4" y="4" width="1" height="1" fill="#222" />
      <rect x="7" y="4" width="1" height="1" fill="#222" />

      {/* ===== peinados ===== */}
      {hairStyle === "short" && (
        <>
          <rect x="3" y="0" width="6" height="2" fill={hair} />
          <rect x="2" y="1" width="8" height="2" fill={hair} />
        </>
      )}
      {hairStyle === "einstein" && (
        <>
          <rect x="2" y="0" width="8" height="3" fill={hair} />
          <rect x="1" y="1" width="1.4" height="2" fill={hair} />
          <rect x="9.6" y="1" width="1.4" height="2" fill={hair} />
          <rect x="3" y="-0.6" width="1.4" height="1" fill={hair} />
          <rect x="7.4" y="-0.6" width="1.4" height="1" fill={hair} />
        </>
      )}
      {hairStyle === "spiky" && (
        <>
          <rect x="2" y="1" width="8" height="2" fill={hair} />
          <rect x="3" y="0" width="1.2" height="1.4" fill={hair} />
          <rect x="5.4" y="-0.3" width="1.2" height="1.6" fill={hair} />
          <rect x="7.8" y="0" width="1.2" height="1.4" fill={hair} />
        </>
      )}
      {hairStyle === "cap" && (
        <>
          <rect x="2.6" y="1.6" width="6.8" height="1.2" fill={hair} />
          <rect x="2" y="0" width="8" height="2" fill={capColor} />
          <rect x="8.6" y="1.6" width="3" height="0.9" fill={capColor} />
          <rect x="2" y="0" width="8" height="0.6" fill="rgba(255,255,255,0.25)" />
        </>
      )}
      {hairStyle === "ponytail" && (
        <>
          <rect x="3" y="0" width="6" height="2" fill={hair} />
          <rect x="2" y="1" width="8" height="2" fill={hair} />
          <rect x="9.4" y="2.4" width="1.2" height="3.6" fill={hair} />
        </>
      )}
      {hairStyle === "afro" && (
        <>
          <rect x="2" y="-0.6" width="8" height="3.6" fill={hair} />
          <rect x="1.4" y="0.4" width="1" height="2" fill={hair} />
          <rect x="9.6" y="0.4" width="1" height="2" fill={hair} />
        </>
      )}

      {/* ===== accesorios ===== */}
      {accessory === "glasses" && (
        <>
          <rect x="3.4" y="3.7" width="1.9" height="1.6" fill="none" stroke="#2a2a3a" strokeWidth="0.4" />
          <rect x="6.7" y="3.7" width="1.9" height="1.6" fill="none" stroke="#2a2a3a" strokeWidth="0.4" />
          <rect x="5.3" y="4.2" width="1.4" height="0.4" fill="#2a2a3a" />
        </>
      )}
      {accessory === "headset" && (
        <>
          <rect x="2.4" y="0.2" width="7.2" height="0.7" fill="#3a3a4a" />
          <rect x="1.8" y="3.2" width="1" height="1.8" fill="#3a3a4a" />
          <rect x="9.2" y="3.2" width="1" height="1.8" fill="#3a3a4a" />
          <rect x="9" y="5" width="1.6" height="0.5" fill="#3a3a4a" />
          <rect x="8.6" y="5.2" width="0.6" height="0.6" fill="#66f28a" />
        </>
      )}
      {accessory === "tie" && (
        <rect x="5.5" y="6.2" width="1" height="2.6" fill="#c0392b" />
      )}
      {accessory === "badge" && (
        <>
          <rect x="3" y="6.6" width="1.2" height="1.2" fill="#b088e0" />
          <rect x="3.3" y="6.9" width="0.6" height="0.6" fill="#e8ddff" />
        </>
      )}
    </svg>
  );
}

/** Config visual de Jarvis: camiseta de Ecuador 🇪🇨, headset y su balón. */
export const JARVIS_SPRITE: PersonConfig = {
  hair: "#e8e8e8",
  skin: "#f0c8a0",
  shirt: "#ffd94a", // amarillo tricolor
  pants: "#2a4bc4", // azul
  hairStyle: "einstein",
  outfit: "jersey",
  outfitAccent: "#e04040", // rojo del cuello y mangas
  accessory: "headset",
  hold: "ball",
};

/* Paleta del sprite de Jarvis (estilo sprite-sheet: contorno + 3 tonos) */
const OUT = "#1c1c2b"; // contorno
const HAIR = "#eeeef4";
const HAIR_HI = "#fbfbff";
const HAIR_SH = "#c6c6d6";
const SKIN2 = "#f2c99e";
const SKIN_SH = "#d9a877";
const YEL = "#ffd83d";
const YEL_SH = "#e0ae1e";
const RED = "#e04545";
const BLU = "#2a4bc4";
const BLU_SH = "#1d3590";
const GEAR = "#3a3a52";
const DARKK = "#232330";

/* Frames de animación de Jarvis (offsets en píxeles del viewBox) */
const J_IDLE = [
  { bob: 0, la: 0, ra: 0, lf: 0, rf: 0 },
  { bob: 0, la: 0, ra: 0, lf: 0, rf: 0 },
  { bob: 0.5, la: 0, ra: 0, lf: 0, rf: 0 },
  { bob: 0, la: 0, ra: 0, lf: 0, rf: 0 },
];
const J_WALK = [
  { bob: 0, la: -1, ra: 1, lf: -1, rf: 0 }, // paso izquierdo
  { bob: -0.5, la: 0, ra: 0, lf: -0.5, rf: -0.5 },
  { bob: 0, la: 1, ra: -1, lf: 0, rf: -1 }, // paso derecho
  { bob: -0.5, la: 0, ra: 0, lf: -0.5, rf: -0.5 },
];

/**
 * Sprite principal de Jarvis (20x32, proporciones altas de sprite-sheet):
 * contorno completo, sombreado por material, camiseta de Ecuador con
 * el 10, headset con micrófono, medias y botines — animado por frames
 * (idle respira, walk alterna piernas y balancea los brazos).
 */
export function JarvisSprite({
  moving = false,
  frame = 0,
}: {
  moving?: boolean;
  frame?: number;
}) {
  const f = moving ? J_WALK[frame % J_WALK.length] : J_IDLE[frame % J_IDLE.length];
  return (
    <svg
      viewBox="0 0 20 32"
      className="w-full h-full pixelated"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {/* ===== piernas (alternan al caminar) ===== */}
      <g transform={`translate(0 ${f.lf})`}>
        <rect x="5" y="26" width="4" height="6" fill={OUT} />
        <rect x="6" y="26" width="2" height="1" fill={SKIN2} />
        <rect x="6" y="27" width="2" height="1" fill={BLU} />
        <rect x="6" y="28" width="2" height="2" fill={YEL} />
        <rect x="5" y="30" width="4" height="2" fill={DARKK} />
      </g>
      <g transform={`translate(0 ${f.rf})`}>
        <rect x="11" y="26" width="4" height="6" fill={OUT} />
        <rect x="12" y="26" width="2" height="1" fill={SKIN2} />
        <rect x="12" y="27" width="2" height="1" fill={BLU} />
        <rect x="12" y="28" width="2" height="2" fill={YEL} />
        <rect x="11" y="30" width="4" height="2" fill={DARKK} />
      </g>

      {/* ===== cuerpo (respira en idle) ===== */}
      <g transform={`translate(0 ${f.bob})`}>
        {/* --- torso + short: silueta --- */}
        <rect x="4" y="12" width="12" height="14" fill={OUT} />
        {/* camiseta amarilla con sombra lateral y pliegue */}
        <rect x="5" y="13" width="10" height="8" fill={YEL} />
        <rect x="13" y="13" width="2" height="8" fill={YEL_SH} />
        <rect x="6" y="19" width="7" height="1" fill={YEL_SH} />
        {/* cuello rojo en V */}
        <rect x="8" y="13" width="4" height="1" fill={RED} />
        <rect x="9" y="14" width="2" height="1" fill={RED} />
        {/* número 10 azul */}
        <rect x="7" y="15" width="1" height="3" fill={BLU} />
        <rect x="10" y="15" width="3" height="1" fill={BLU} />
        <rect x="10" y="17" width="3" height="1" fill={BLU} />
        <rect x="10" y="15" width="1" height="3" fill={BLU} />
        <rect x="12" y="15" width="1" height="3" fill={BLU} />
        {/* cinturilla + short azul con franja amarilla */}
        <rect x="5" y="21" width="10" height="1" fill={YEL_SH} />
        <rect x="5" y="22" width="10" height="3" fill={BLU} />
        <rect x="5" y="22" width="1" height="3" fill={YEL} />
        <rect x="14" y="22" width="1" height="3" fill={YEL} />
        <rect x="5" y="24" width="10" height="1" fill={BLU_SH} />

        {/* --- brazos (balancean al caminar) --- */}
        <g transform={`translate(0 ${f.la})`}>
          <rect x="2" y="13" width="2" height="8" fill={OUT} />
          <rect x="2.5" y="14" width="1" height="2" fill={RED} />
          <rect x="2.5" y="16" width="1" height="3" fill={SKIN2} />
          <rect x="2.5" y="19" width="1" height="1" fill={SKIN_SH} />
        </g>
        <g transform={`translate(0 ${f.ra})`}>
          <rect x="16" y="13" width="2" height="8" fill={OUT} />
          <rect x="16.5" y="14" width="1" height="2" fill={RED} />
          <rect x="16.5" y="16" width="1" height="3" fill={SKIN2} />
          <rect x="16.5" y="19" width="1" height="1" fill={SKIN_SH} />
        </g>

        {/* --- cabeza --- */}
        {/* silueta: melena + cara */}
        <rect x="3" y="0" width="14" height="7" fill={OUT} />
        <rect x="4" y="6" width="12" height="6" fill={OUT} />
        {/* pelo blanco alborotado con brillo y sombra */}
        <rect x="4" y="1" width="12" height="5" fill={HAIR} />
        <rect x="5" y="2" width="4" height="1" fill={HAIR_HI} />
        <rect x="4" y="5" width="12" height="1" fill={HAIR_SH} />
        {/* cara con ceja de sombra */}
        <rect x="5" y="7" width="10" height="4" fill={SKIN2} />
        <rect x="5" y="7" width="10" height="1" fill={SKIN_SH} />
        {/* ojos de 2px (estilo referencia) */}
        <rect x="7" y="8" width="1" height="2" fill={DARKK} />
        <rect x="12" y="8" width="1" height="2" fill={DARKK} />
        {/* boca */}
        <rect x="9" y="10" width="2" height="1" fill={SKIN_SH} />
        {/* headset: auriculares + micrófono con LED */}
        <rect x="4" y="7" width="1" height="3" fill={GEAR} />
        <rect x="15" y="7" width="1" height="3" fill={GEAR} />
        <rect x="14" y="10" width="2" height="1" fill={GEAR} />
        <rect x="13" y="10" width="1" height="1" fill="#66f28a" />
      </g>

      {/* ===== balón (siempre a su pie) ===== */}
      <circle cx="17.5" cy="29.5" r="2.4" fill="#ffffff" stroke={OUT} strokeWidth="0.6" />
      <rect x="16.5" y="28.5" width="2" height="2" fill={OUT} />
      <rect x="15.4" y="30.2" width="1" height="1" fill={OUT} />
      <rect x="18.6" y="30.6" width="1" height="1" fill={OUT} />
      <rect x="18.2" y="27.2" width="1" height="1" fill={OUT} />
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

/** Jarvis: personaje principal, animado por frames (idle/walk). */
export default function JarvisCharacter({ state, x, y, walking }: Props) {
  const moving = state === "running" || !!walking;
  const { frame } = useCharacterAnimation(JARVIS_ANIMATIONS, moving ? "walk" : "idle");
  return (
    <div
      className="absolute character-move z-30 flex flex-col items-center"
      style={{ left: `${x}%`, top: `${y}%`, width: "7.4%" }}
    >
      <div className="h-4 mb-0.5 flex items-end">
        <StateIndicator state={state} />
      </div>
      <FloatingLabel
        name="Jarvis"
        color={STATE_COLOR[state]}
        blinking={state === "running" || state === "thinking"}
      />
      {/* sin filtros ni CSS-bob: la animación real la llevan los frames */}
      <div className="relative w-full aspect-[20/32] mt-0.5">
        <div className="sprite-shadow" />
        <JarvisSprite moving={moving} frame={frame} />
      </div>
    </div>
  );
}
