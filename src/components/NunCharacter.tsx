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

/* ===== Sprite de la Oracle por matriz (28x41 + botas) =====
 * Rediseño según la ficha técnica de la sacerdotisa: banda dorada
 * bajo el velo enmarcando la frente, pechera dorada como detalle
 * principal del torso, mechón de cabello asomando (porte 3/4),
 * cintura entallada, falda larga con caída acampanada y doble
 * remate dorado. Paleta sobria: negro azulado, dorado viejo, crema,
 * piel cálida y sombras violáceas. */
const NUN_PALETTE: Record<string, string> = {
  O: "#14141f", // contorno
  V: "#2b2b47", // hábito base (azul noche)
  v: "#1e1e35", // sombra violácea profunda
  L: "#40406a", // brillo del velo
  W: "#f4efe2", // crema de la cofia
  w: "#d8d0ba", // crema sombra
  S: "#eec39a", // piel cálida
  s: "#cf9c72", // piel sombra
  K: "#20202c", // ojos
  F: "#f0cf7a", // dorado claro (brillo)
  G: "#d9ae4e", // dorado viejo
  g: "#a77f2a", // dorado oscuro
  H: "#4a3626", // mechón de cabello
};

const NUN_BODY: string[] = [
  "............OOOO............",
  "...........OVVVVO...........",
  "..........OVVLVVVO..........",
  "..........OVLVVVVO..........",
  ".........OVVLVVVVVO.........",
  ".........OVVVVVVVVO.........",
  "........OVVFGGGGFVVO........",
  "........OVGgGGGGgGVO........",
  ".......OVWSSSSSSSSWVO.......",
  ".......OVHSSSSSSSSWVO.......",
  ".......OVHSSKSSKSSWVO.......",
  ".......OVWSSSSSSSSWVO.......",
  ".......OVWsSSSSSSsWVO.......",
  ".......OVWwsssssswWVO.......",
  "......OVVvWWWWWWWWvVVO......",
  "......OVvVVVVVVVVVVvVO......",
  ".....OVVvVVVVVVVVVVvVVO.....",
  "......OVvFGGGGGGGGFvVO......",
  "......OVvGGGGGGGGGGvVO......",
  "......OVvgGGGGGGGGgvVO......",
  "......OVvVVVVVVVVVVvVO......",
  "......OVvVVVVVVVVVVvVO......",
  "......OVvVVVVVVVVVVvVO......",
  "........OvVVVVVVVVvO........",
  "........OvVVVVVVVVvO........",
  ".......OVvVVVVVVVVvVO.......",
  ".......OVvVVVVVVVVvVO.......",
  "......OVvVVVVVVVVVVvVO......",
  "......OVvVVVVVVVVVVvVO......",
  ".....OVVvVVVVVVVVVVvVVO.....",
  ".....OVvVVVVVVVVVVVVvVO.....",
  "....OVVvVVVVVVVVVVVVvVVO....",
  "....OVvVVVVVVVVVVVVVVvVO....",
  "...OVVvVVVVVVVVVVVVVVvVVO...",
  "...OVvVVVVVVVVVVVVVVVVvVO...",
  "..OVVvVVVVVVVVVVVVVVVVvVVO..",
  "..OVvVVVVVVVVVVVVVVVVVVvVO..",
  "..OVvVVVVVVVVVVVVVVVVVVvVO..",
  "..OFGGGGGGGGGGGGGGGGGGGGFO..",
  "..OggggggggggggggggggggggO..",
  "..OOOOOOOOOOOOOOOOOOOOOOOO..",
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
      viewBox="0 0 28 44"
      className="w-full h-full pixelated"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {/* aura del ritual (special): crece con la secuencia */}
      {state === "special" && sp > 0.15 && (
        <>
          <circle cx="14" cy="1" r={sp * 4} fill="#f6e28a" opacity={0.4 + sp * 0.3} />
          <circle cx="14" cy="1" r={sp * 2} fill="#fff2b0" opacity={0.9} />
          {sp > 0.7 && (
            <>
              <rect x="6" y="-1" width="1" height="1" fill="#f6e28a" />
              <rect x="21" y="0" width="1" height="1" fill="#f6e28a" />
            </>
          )}
        </>
      )}

      {/* botas (asoman bajo el hábito, alternan al caminar) */}
      <rect x={9 + (walk?.lf ?? 0)} y="41" width="3" height="2" fill="#5a3a2c" />
      <rect x={9 + (walk?.lf ?? 0)} y="43" width="3" height="1" fill="#3c2419" />
      <rect x={16 + (walk?.rf ?? 0)} y="41" width="3" height="2" fill="#5a3a2c" />
      <rect x={16 + (walk?.rf ?? 0)} y="43" width="3" height="1" fill="#3c2419" />

      {/* cuerpo completo por matriz (respira en idle, se mece al andar) */}
      <g
        transform={`translate(0 ${breath + bob})${
          dialog ? ` rotate(${dialog.tilt} 14 24)` : ""
        }`}
      >
        <PixelGrid rows={NUN_BODY} palette={NUN_PALETTE} />

        {/* manos según el estado (encima de la matriz) */}
        {state === "special" ? (
          // ritual: ambas manos elevadas con puños dorados
          <>
            <rect x="5" y={18 - sp * 7} width="2" height="2" fill={SKIN} />
            <rect x="21" y={18 - sp * 7} width="2" height="2" fill={SKIN} />
            <rect x="5" y={20 - sp * 7} width="2" height="1" fill="#d9ae4e" />
            <rect x="21" y={20 - sp * 7} width="2" height="1" fill="#d9ae4e" />
          </>
        ) : state === "attack" ? (
          // bendición proyectada: el brazo se extiende y sale el destello
          <>
            <rect x={20 + atk * 4} y="19" width="2" height="2" fill={SKIN} />
            {atk > 0.6 && <circle cx={24 + atk * 4} cy="20" r={1.3} fill="#ffe066" />}
            <rect x="10" y="21" width="3" height="2" fill={SKIN} />
          </>
        ) : dialog ? (
          // diálogo: una mano gesticula, la otra queda recogida
          <>
            <rect x="20" y={dialog.handY + 7} width="2" height="2" fill={SKIN} />
            <rect x="10" y="21" width="3" height="2" fill={SKIN} />
          </>
        ) : (
          // idle/walk: manos juntas al frente con puños dorados (ficha)
          <>
            <rect x="10" y="20" width="3" height="1" fill="#d9ae4e" />
            <rect x="15" y="20" width="3" height="1" fill="#d9ae4e" />
            <rect x="12" y="21" width="4" height="2" fill={SKIN} />
            <rect x="12" y="22" width="4" height="1" fill={SKIN_SH2} />
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
    <div className="relative w-full aspect-[28/44] mt-0.5">
      <div className="sprite-shadow" />
      <NunSprite state={state} frame={frame} />
    </div>
  );
}
