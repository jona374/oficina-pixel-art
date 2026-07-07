"use client";

import { useEffect, useState } from "react";
import { NUN_ANIMATIONS, type AnimState } from "@/lib/characterAnimations";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";

/* ============================================================
   Oracle — monja/sacerdotisa pixel-art (arte propio, inspirada
   en los packs retro clásicos: hábito negro, cofia blanca y
   dobladillo dorado). Animada por frames, no por CSS.
   ============================================================ */

const BLACK = "#23233a";
const BLACK_DARK = "#16162a";
const GOLD = "#d8b040";
const SKIN = "#f0c8a0";
const WHITE = "#f4f0e4";

/* Parámetros por frame de cada secuencia (unidades del viewBox 12x16) */
const IDLE_BREATH = [0, 0.25, 0.5, 0.25]; // dy del torso
const WALK_FRAMES = [
  { hem: -0.5, bob: 0.0, lf: -0.6, rf: 0.6 }, // paso izquierdo
  { hem: 0.0, bob: -0.35, lf: 0.0, rf: 0.0 }, // juntos (impulso)
  { hem: 0.5, bob: 0.0, lf: 0.6, rf: -0.6 }, // paso derecho
  { hem: 0.0, bob: -0.35, lf: 0.0, rf: 0.0 },
];
const DIALOG_FRAMES = [
  { handY: 7.6, tilt: 0 },
  { handY: 7.0, tilt: -3 },
  { handY: 7.3, tilt: 2 },
  { handY: 7.6, tilt: 0 },
];

export function NunSprite({ state, frame }: { state: AnimState; frame: number }) {
  const breath = state === "idle" ? IDLE_BREATH[frame % IDLE_BREATH.length] : 0;
  const walk = state === "walk" ? WALK_FRAMES[frame % WALK_FRAMES.length] : null;
  const dialog = state === "dialogue" ? DIALOG_FRAMES[frame % DIALOG_FRAMES.length] : null;
  // progreso 0..1 de las secuencias ceremoniales
  const sp = state === "special" ? frame / (NUN_ANIMATIONS.special.frames - 1) : 0;
  const atk = state === "attack" ? frame / (NUN_ANIMATIONS.attack.frames - 1) : 0;

  const bob = walk ? walk.bob : 0;
  const hem = walk ? walk.hem : 0;

  return (
    <svg
      viewBox="0 0 12 16"
      className="w-full h-full pixelated"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {/* aura del ritual (special): crece con la secuencia */}
      {state === "special" && sp > 0.15 && (
        <>
          <circle cx="6" cy="0" r={sp * 1.7} fill="#f6e28a" opacity={0.35 + sp * 0.3} />
          <circle cx="6" cy="0" r={sp * 0.9} fill="#fff2b0" opacity={0.8} />
          {sp > 0.7 && (
            <>
              <rect x="2.6" y="-0.8" width="0.6" height="0.6" fill="#f6e28a" />
              <rect x="9" y="-0.4" width="0.6" height="0.6" fill="#f6e28a" />
            </>
          )}
        </>
      )}

      {/* pies (asoman bajo el hábito al caminar) */}
      <rect x={4 + (walk?.lf ?? 0)} y="14.5" width="1.3" height="1.1" fill={BLACK_DARK} />
      <rect x={6.7 + (walk?.rf ?? 0)} y="14.5" width="1.3" height="1.1" fill={BLACK_DARK} />

      {/* hábito: falda acampanada con dobladillo dorado (se mece al andar) */}
      <g transform={`translate(${hem} ${bob})`}>
        <rect x="2.6" y="9.5" width="6.8" height="4.6" fill={BLACK} />
        <rect x="3.1" y="9.5" width="5.8" height="4.6" fill={BLACK_DARK} />
        <rect x="2.6" y="13.6" width="6.8" height="0.9" fill={GOLD} />
      </g>

      {/* torso (respira en idle) */}
      <g transform={`translate(0 ${breath + bob})`}>
        <rect x="3.2" y="5.2" width="5.6" height="4.6" fill={BLACK} />
        <rect x="3.7" y="5.2" width="4.6" height="4.6" fill={BLACK_DARK} />
        {/* cíngulo dorado */}
        <rect x="4.3" y="8.4" width="3.4" height="0.5" fill={GOLD} />

        {/* manos según el estado */}
        {state === "special" ? (
          // ritual: ambas manos elevadas, suben con la secuencia
          <>
            <rect x="2.4" y={6.2 - sp * 2.2} width="1.2" height="1.1" fill={SKIN} />
            <rect x="8.4" y={6.2 - sp * 2.2} width="1.2" height="1.1" fill={SKIN} />
          </>
        ) : state === "attack" ? (
          // bendición proyectada: el brazo se extiende y sale el destello
          <>
            <rect x={8.4 + atk * 2.6} y="7.2" width="1.3" height="1.1" fill={SKIN} />
            {atk > 0.6 && (
              <circle cx={10.6 + atk * 2.2} cy="7.7" r={0.7} fill="#ffe066" />
            )}
            <rect x="4.9" y="8.7" width="1.4" height="1" fill={SKIN} />
          </>
        ) : dialog ? (
          // diálogo: una mano gesticula, la otra queda recogida
          <>
            <rect x="8.5" y={dialog.handY} width="1.3" height="1.1" fill={SKIN} />
            <rect x="4.9" y="8.7" width="1.4" height="1" fill={SKIN} />
          </>
        ) : (
          // idle/walk: manos recogidas al frente
          <rect x="4.9" y="8.7" width="2.2" height="1.1" fill={SKIN} />
        )}

        {/* cabeza con velo y cofia (ligera inclinación al dialogar) */}
        <g transform={dialog ? `rotate(${dialog.tilt} 6 3)` : undefined}>
          {/* velo negro que cae a los lados */}
          <rect x="2.4" y="0.6" width="1.3" height="7.4" fill={BLACK} />
          <rect x="8.3" y="0.6" width="1.3" height="7.4" fill={BLACK} />
          <rect x="2.4" y="0" width="7.2" height="2.2" fill={BLACK} />
          {/* cofia blanca */}
          <rect x="3.6" y="1" width="4.8" height="3.6" fill={WHITE} />
          {/* rostro */}
          <rect x="4.1" y="1.7" width="3.8" height="2.6" fill={SKIN} />
          <rect x="4.8" y="2.6" width="0.7" height="0.7" fill="#222" />
          <rect x="6.5" y="2.6" width="0.7" height="0.7" fill="#222" />
          {/* borde superior del velo */}
          <rect x="2.4" y="0" width="7.2" height="0.7" fill={BLACK_DARK} />
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
    <div className="relative w-[78%] aspect-[12/16] mt-0.5">
      <div className="sprite-shadow" />
      <NunSprite state={state} frame={frame} />
    </div>
  );
}
