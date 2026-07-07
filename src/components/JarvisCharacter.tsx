"use client";

import type { AgentState } from "@/types/agent";
import FloatingLabel from "./FloatingLabel";
import { JARVIS_ANIMATIONS } from "@/lib/characterAnimations";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { PixelGrid } from "./PixelSprite";

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

/* Cuerpo de Jarvis por matriz (22 de ancho): melena orgánica con
 * brillo, cara con boca, camiseta entallada con cuello en V y el 10,
 * short con franjas. Brazos y piernas van como capas animadas. */
const JARVIS_PALETTE: Record<string, string> = {
  O: OUT,
  H: HAIR,
  I: HAIR_HI,
  h: HAIR_SH,
  S: SKIN2,
  s: SKIN_SH,
  K: DARKK,
  Y: YEL,
  y: YEL_SH,
  R: RED,
  B: BLU,
  b: BLU_SH,
};

const JARVIS_BODY: string[] = [
  ".....OOOOOOOOOOOO.....",
  "....OHHHHHHHHHHHHO....",
  "...OHHIIHHHHHHHHHHO...",
  "..OHHHHHHHHHHHHHHHHO..",
  "..OHHHHHHHHHHHHHHHHO..",
  "..OHhHHHHHHHHHHHHhHO..",
  "..OhhhhhhhhhhhhhhhhO..",
  "..OsSSSSSSSSSSSSSSsO..",
  "..OSSSKKSSSSSSKKSSSO..",
  "..OSSSKKSSSSSSKKSSSO..",
  "..OSSSSSSSssSSSSSSSO..",
  "...OOSSSSSSSSSSSSOO...",
  "....OOOOOOOOOOOOOO....",
  "....OYYYYRRRRYYYYO....",
  "....OYYYYYRRYYYYYO....",
  "....OYYYYYYYYYYYyO....",
  "....OYBYYYBBBYYYyO....",
  "....OYBYYYBYBYYYyO....",
  "....OYBYYYBBBYYYyO....",
  "....OYYYYYYYYYYYyO....",
  "....OYyYYYYYYYYyyO....",
  "....OyyyyyyyyyyyyO....",
  "....OYBBBBBBBBBBYO....",
  "....OYBBBBBBBBBBYO....",
  "....ObbBBBBBBBBbbO....",
  "....OOOOOOOOOOOOOO....",
];

/**
 * Sprite principal de Jarvis (22x34, silueta orgánica por matriz):
 * animado por frames — idle respira, walk alterna piernas y balancea
 * los brazos. El balón siempre va a su pie.
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
      viewBox="0 0 22 34"
      className="w-full h-full pixelated"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {/* ===== piernas (alternan al caminar) ===== */}
      <g transform={`translate(0 ${f.lf})`}>
        <rect x="6" y="26" width="4" height="8" fill={OUT} />
        <rect x="7" y="26" width="2" height="1" fill={SKIN2} />
        <rect x="7" y="27" width="2" height="1" fill={BLU} />
        <rect x="7" y="28" width="2" height="2" fill={YEL} />
        <rect x="7" y="30" width="2" height="3" fill={DARKK} />
      </g>
      <g transform={`translate(0 ${f.rf})`}>
        <rect x="12" y="26" width="4" height="8" fill={OUT} />
        <rect x="13" y="26" width="2" height="1" fill={SKIN2} />
        <rect x="13" y="27" width="2" height="1" fill={BLU} />
        <rect x="13" y="28" width="2" height="2" fill={YEL} />
        <rect x="13" y="30" width="2" height="3" fill={DARKK} />
      </g>

      {/* ===== cuerpo (respira en idle) ===== */}
      <g transform={`translate(0 ${f.bob})`}>
        {/* brazos detrás del torso (balancean al caminar) */}
        <g transform={`translate(0 ${f.la})`}>
          <rect x="1" y="13" width="4" height="10" fill={OUT} />
          <rect x="2" y="14" width="2" height="3" fill={RED} />
          {/* cinta de capitán */}
          <rect x="2" y="17" width="2" height="1" fill={YEL} />
          <rect x="2" y="18" width="2" height="3" fill={SKIN2} />
          <rect x="2" y="21" width="2" height="1" fill={SKIN_SH} />
        </g>
        <g transform={`translate(0 ${f.ra})`}>
          <rect x="17" y="13" width="4" height="10" fill={OUT} />
          <rect x="18" y="14" width="2" height="3" fill={RED} />
          <rect x="18" y="17" width="2" height="4" fill={SKIN2} />
          <rect x="18" y="21" width="2" height="1" fill={SKIN_SH} />
        </g>

        {/* cabeza + torso + short por matriz */}
        <PixelGrid rows={JARVIS_BODY} palette={JARVIS_PALETTE} />

        {/* headset: auriculares + micrófono con LED */}
        <rect x="1" y="7" width="1" height="3" fill={GEAR} />
        <rect x="20" y="7" width="1" height="3" fill={GEAR} />
        <rect x="17" y="10" width="3" height="1" fill={GEAR} />
        <rect x="16" y="10" width="1" height="1" fill="#66f28a" />
      </g>

      {/* ===== balón (siempre a su pie) ===== */}
      <circle cx="19.5" cy="31.5" r="2.4" fill="#ffffff" stroke={OUT} strokeWidth="0.6" />
      <rect x="18.5" y="30.5" width="2" height="2" fill={OUT} />
      <rect x="17.4" y="32.2" width="1" height="1" fill={OUT} />
      <rect x="20.6" y="32.4" width="1" height="1" fill={OUT} />
      <rect x="20.2" y="29.2" width="1" height="1" fill={OUT} />
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
      <div className="relative w-full aspect-[22/34] mt-0.5">
        <div className="sprite-shadow" />
        <JarvisSprite moving={moving} frame={frame} />
      </div>
    </div>
  );
}
