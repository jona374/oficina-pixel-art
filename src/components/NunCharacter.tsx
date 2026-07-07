"use client";

import { useEffect, useState } from "react";
import { NUN_ANIMATIONS, type AnimState } from "@/lib/characterAnimations";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { PixelGrid } from "./PixelSprite";

/* ============================================================
   Oracle — monja/sacerdotisa pixel-art (arte propio, inspirada
   en los packs retro clásicos: hábito negro, cofia blanca y
   dobladillo dorado). Animada por frames, no por CSS.
   ============================================================ */

const BLACK = "#2e2e48";
const BLACK_DARK = "#1c1c30";
const OUTLINE = "#12121f";
const GOLD = "#e0b846";
const SKIN = "#f2c99e";
const WHITE = "#f6f2e6";

/* Parámetros por frame (unidades enteras del viewBox 14x18 para
 * mantener el sprite nítido, sin antialiasing) */
const IDLE_BREATH = [0, 0, 1, 0]; // dy del torso (px enteros, sutil)
const WALK_FRAMES = [
  { hem: -1, bob: 0, lf: -1, rf: 1 }, // paso izquierdo
  { hem: 0, bob: -1, lf: 0, rf: 0 }, // juntos (impulso)
  { hem: 1, bob: 0, lf: 1, rf: -1 }, // paso derecho
  { hem: 0, bob: -1, lf: 0, rf: 0 },
];
const DIALOG_FRAMES = [
  { handY: 9, tilt: 0 },
  { handY: 8, tilt: -3 },
  { handY: 8, tilt: 2 },
  { handY: 9, tilt: 0 },
];

const BLACK_HI = "#3d3d5e"; // brillo del velo
const WHITE_SH = "#d8d2c0";
const GOLD_SH = "#b3902e";
const SKIN_SH2 = "#d9a877";

/* ===== Sprite de la Oracle dibujado por matriz (24x37 + botas) =====
 * Silueta orgánica fila a fila, como el sprite sheet de referencia:
 * velo en pico, cofia que enmarca el rostro, cuello dorado, cruz,
 * cintura entallada, falda acampanada y doble banda dorada. */
const NUN_PALETTE: Record<string, string> = {
  O: "#14141f", // contorno
  V: "#2b2b47", // hábito base
  v: "#1e1e35", // sombra profunda
  L: "#40406a", // brillo del velo
  W: "#f4efe2", // cofia
  w: "#d8d0ba", // cofia sombra
  S: "#eec39a", // piel
  s: "#cf9c72", // piel sombra
  K: "#20202c", // ojos
  G: "#d9ae4e", // dorado
  g: "#a77f2a", // dorado oscuro
  H: "#4a3626", // mechón de cabello bajo la cofia
};

const NUN_BODY: string[] = [
  "..........OOOO..........",
  ".........OVVVVO.........",
  ".........OVLVVO.........",
  "........OVVLVVVO........",
  "........OVVVVVVO........",
  ".......OVVVVVVVVO.......",
  ".......OVWWWWWWVO.......",
  "......OVWWWWWWWWVO......",
  "......OVWHSSSSSWVO......",
  "......OVWHSSSSSWVO......",
  "......OVWSKSSKSWVO......",
  "......OVWSSSSSSWVO......",
  "......OVWsSSSSsWVO......",
  "......OVwWSSSSWwVO......",
  ".....OVVvWWWWWWvVVO.....",
  ".....OVvVVVVVVVVVvO.....",
  "....OVvVVVVVVVVVVvVO....",
  "....OVvVVVGGGGVVVvVO....",
  "....OVvVVVVGGVVVVvVO....",
  "....OVvVVVVGVVVVVvVO....",
  "....OVvVVVGGGVVVVvVO....",
  "....OVvVVVVGVVVVVvVO....",
  "....OVvVVVVVVVVVVvVO....",
  ".....OvVVVVVVVVVVvO.....",
  ".....OvVVVVVVVVVVvO.....",
  ".....OVvVVVVVVVVvVO.....",
  "....OVVvVVVVVVVVvVVO....",
  "....OVvVVVVVVVVVVvVO....",
  "...OVVvVVVVVVVVVVvVVO...",
  "...OVvVVVVVVVVVVVVvVO...",
  "..OVVvVVVVVVVVVVVVvVVO..",
  "..OVvVVVVVVVVVVVVVVvVO..",
  "..OVvVVVVVVVVVVVVVVvVO..",
  ".OVVvVVVVVVVVVVVVVVvVVO.",
  ".OGGGGGGGGGGGGGGGGGGGGO.",
  ".OggggggggggggggggggggO.",
  "..OOOOOOOOOOOOOOOOOOOO..",
];

export function NunSprite({ state, frame }: { state: AnimState; frame: number }) {
  const breath = state === "idle" ? IDLE_BREATH[frame % IDLE_BREATH.length] * 0.5 : 0;
  const walk = state === "walk" ? WALK_FRAMES[frame % WALK_FRAMES.length] : null;
  const dialog = state === "dialogue" ? DIALOG_FRAMES[frame % DIALOG_FRAMES.length] : null;
  // progreso 0..1 de las secuencias ceremoniales
  const sp = state === "special" ? frame / (NUN_ANIMATIONS.special.frames - 1) : 0;
  const atk = state === "attack" ? frame / (NUN_ANIMATIONS.attack.frames - 1) : 0;

  const bob = walk ? walk.bob * 0.5 : 0;

  return (
    <svg
      viewBox="0 0 24 40"
      className="w-full h-full pixelated"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {/* aura del ritual (special): crece con la secuencia */}
      {state === "special" && sp > 0.15 && (
        <>
          <circle cx="12" cy="1" r={sp * 3.6} fill="#f6e28a" opacity={0.4 + sp * 0.3} />
          <circle cx="12" cy="1" r={sp * 1.8} fill="#fff2b0" opacity={0.9} />
          {sp > 0.7 && (
            <>
              <rect x="5" y="-1" width="1" height="1" fill="#f6e28a" />
              <rect x="18" y="0" width="1" height="1" fill="#f6e28a" />
            </>
          )}
        </>
      )}

      {/* botas (asoman bajo el hábito, alternan al caminar) */}
      <rect x={7 + (walk?.lf ?? 0)} y="36" width="3" height="2" fill="#5a3a2c" />
      <rect x={7 + (walk?.lf ?? 0)} y="38" width="3" height="1" fill="#3c2419" />
      <rect x={14 + (walk?.rf ?? 0)} y="36" width="3" height="2" fill="#5a3a2c" />
      <rect x={14 + (walk?.rf ?? 0)} y="38" width="3" height="1" fill="#3c2419" />

      {/* cuerpo completo por matriz (respira en idle, se mece al andar) */}
      <g
        transform={`translate(0 ${breath + bob})${
          dialog ? ` rotate(${dialog.tilt} 12 20)` : ""
        }`}
      >
        <PixelGrid rows={NUN_BODY} palette={NUN_PALETTE} />

        {/* manos según el estado (encima de la matriz) */}
        {state === "special" ? (
          // ritual: ambas manos elevadas, suben con la secuencia
          <>
            <rect x="4" y={16 - sp * 6} width="2" height="2" fill={SKIN} />
            <rect x="18" y={16 - sp * 6} width="2" height="2" fill={SKIN} />
          </>
        ) : state === "attack" ? (
          // bendición proyectada: el brazo se extiende y sale el destello
          <>
            <rect x={17 + atk * 4} y="17" width="2" height="2" fill={SKIN} />
            {atk > 0.6 && <circle cx={21 + atk * 4} cy="18" r={1.2} fill="#ffe066" />}
            <rect x="9" y="22" width="3" height="2" fill={SKIN} />
          </>
        ) : dialog ? (
          // diálogo: una mano gesticula, la otra queda recogida
          <>
            <rect x="17" y={dialog.handY + 8} width="2" height="2" fill={SKIN} />
            <rect x="9" y="22" width="3" height="2" fill={SKIN} />
          </>
        ) : (
          // idle/walk: manos recogidas al frente, con sombra
          <>
            <rect x="10" y="22" width="4" height="1" fill={SKIN} />
            <rect x="10" y="23" width="4" height="1" fill={SKIN_SH2} />
          </>
        )}
      </g>
    </svg>
  );
}

type OracleProps = {
  /** true mientras camina (viene del sistema de paseos). */
  walking?: boolean;
  /** true si está fuera de su sitio (pausa en un punto de interés). */
  away?: boolean;
  /** Estado global del agente: cuando Jarvis piensa, ella hace su ritual. */
  agentThinking?: boolean;
};

/**
 * Controlador de la Oracle: decide qué secuencia corresponde según la
 * vida de la oficina y dispara el ritual periódico. La reproducción
 * frame a frame la lleva useCharacterAnimation.
 */
export default function NunCharacter({ walking, away, agentThinking }: OracleProps) {
  const [ritual, setRitual] = useState(false);

  // Ritual periódico cuando está en su sitio (cada ~20-28 s, 2 s de duración).
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let stop = false;
    const cycle = () => {
      timer = setTimeout(() => {
        if (stop) return;
        setRitual(true);
        timer = setTimeout(() => {
          if (stop) return;
          setRitual(false);
          cycle();
        }, 2100);
      }, 20000 + Math.random() * 8000);
    };
    cycle();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, []);

  const requested: AnimState = walking
    ? "walk"
    : away
      ? "dialogue"
      : agentThinking || ritual
        ? "special"
        : "idle";

  const { state, frame } = useCharacterAnimation(NUN_ANIMATIONS, requested);

  return (
    <div className="relative w-full aspect-[24/40] mt-0.5">
      <div className="sprite-shadow" />
      <NunSprite state={state} frame={frame} />
    </div>
  );
}
