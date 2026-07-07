"use client";

import { useEffect, useState } from "react";
import { NUN_ANIMATIONS, type AnimState } from "@/lib/characterAnimations";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";

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

export function NunSprite({ state, frame }: { state: AnimState; frame: number }) {
  const breath = state === "idle" ? IDLE_BREATH[frame % IDLE_BREATH.length] * 0.5 : 0;
  const walk = state === "walk" ? WALK_FRAMES[frame % WALK_FRAMES.length] : null;
  const dialog = state === "dialogue" ? DIALOG_FRAMES[frame % DIALOG_FRAMES.length] : null;
  // progreso 0..1 de las secuencias ceremoniales
  const sp = state === "special" ? frame / (NUN_ANIMATIONS.special.frames - 1) : 0;
  const atk = state === "attack" ? frame / (NUN_ANIMATIONS.attack.frames - 1) : 0;

  const bob = walk ? walk.bob * 0.5 : 0;
  const hem = walk ? walk.hem * 0.5 : 0;

  return (
    <svg
      viewBox="0 0 14 18"
      className="w-full h-full pixelated"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {/* aura del ritual (special): crece con la secuencia */}
      {state === "special" && sp > 0.15 && (
        <>
          <circle cx="7" cy="0" r={sp * 2.2} fill="#f6e28a" opacity={0.4 + sp * 0.3} />
          <circle cx="7" cy="0" r={sp * 1.1} fill="#fff2b0" opacity={0.9} />
          {sp > 0.7 && (
            <>
              <rect x="3" y="-1" width="1" height="1" fill="#f6e28a" />
              <rect x="10" y="0" width="1" height="1" fill="#f6e28a" />
            </>
          )}
        </>
      )}

      {/* pies (asoman bajo el hábito al caminar) */}
      <rect x={4 + (walk?.lf ?? 0)} y="16" width="2" height="2" fill={OUTLINE} />
      <rect x={8 + (walk?.rf ?? 0)} y="16" width="2" height="2" fill={OUTLINE} />

      {/* hábito: falda acampanada con dobladillo dorado (se mece al andar) */}
      <g transform={`translate(${hem} ${bob})`}>
        <rect x="2" y="10" width="10" height="7" fill={OUTLINE} />
        <rect x="3" y="10" width="8" height="6" fill={BLACK} />
        <rect x="4" y="10" width="6" height="6" fill={BLACK_DARK} />
        <rect x="3" y="15" width="8" height="1" fill={GOLD} />
      </g>

      {/* torso (respira en idle) */}
      <g transform={`translate(0 ${breath + bob})`}>
        <rect x="3" y="6" width="8" height="5" fill={OUTLINE} />
        <rect x="4" y="6" width="6" height="5" fill={BLACK} />
        <rect x="5" y="6" width="4" height="5" fill={BLACK_DARK} />
        {/* cíngulo dorado */}
        <rect x="5" y="9" width="4" height="1" fill={GOLD} />

        {/* manos según el estado */}
        {state === "special" ? (
          // ritual: ambas manos elevadas, suben con la secuencia
          <>
            <rect x="2" y={7 - sp * 3} width="2" height="1" fill={SKIN} />
            <rect x="10" y={7 - sp * 3} width="2" height="1" fill={SKIN} />
          </>
        ) : state === "attack" ? (
          // bendición proyectada: el brazo se extiende y sale el destello
          <>
            <rect x={10 + atk * 3} y="8" width="2" height="1" fill={SKIN} />
            {atk > 0.6 && <circle cx={13 + atk * 2.5} cy="8.5" r={0.9} fill="#ffe066" />}
            <rect x="5" y="10" width="2" height="1" fill={SKIN} />
          </>
        ) : dialog ? (
          // diálogo: una mano gesticula, la otra queda recogida
          <>
            <rect x="10" y={dialog.handY} width="2" height="1" fill={SKIN} />
            <rect x="5" y="10" width="2" height="1" fill={SKIN} />
          </>
        ) : (
          // idle/walk: manos recogidas al frente
          <rect x="5" y="10" width="4" height="1" fill={SKIN} />
        )}

        {/* cabeza con velo y cofia (ligera inclinación al dialogar) */}
        <g transform={dialog ? `rotate(${dialog.tilt} 7 3)` : undefined}>
          {/* contorno + velo negro que cae a los lados */}
          <rect x="2" y="0" width="10" height="7" fill={OUTLINE} />
          <rect x="3" y="1" width="8" height="2" fill={BLACK} />
          <rect x="3" y="1" width="1" height="6" fill={BLACK} />
          <rect x="10" y="1" width="1" height="6" fill={BLACK} />
          {/* cofia blanca */}
          <rect x="4" y="1" width="6" height="5" fill={WHITE} />
          {/* rostro */}
          <rect x="5" y="2" width="4" height="4" fill={SKIN} />
          <rect x="5" y="3" width="1" height="1" fill="#232330" />
          <rect x="8" y="3" width="1" height="1" fill="#232330" />
          {/* velo sobre la frente */}
          <rect x="3" y="0" width="8" height="1" fill={BLACK} />
        </g>
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
    <div className="relative w-[92%] aspect-[14/18] mt-0.5">
      <div className="sprite-shadow" />
      <NunSprite state={state} frame={frame} />
    </div>
  );
}
