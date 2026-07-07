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

const BLACK_HI = "#3d3d5e"; // brillo del velo
const WHITE_SH = "#d8d2c0";
const GOLD_SH = "#b3902e";
const SKIN_SH2 = "#d9a877";

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
      viewBox="0 0 20 34"
      className="w-full h-full pixelated"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {/* aura del ritual (special): crece con la secuencia */}
      {state === "special" && sp > 0.15 && (
        <>
          <circle cx="10" cy="1" r={sp * 3.2} fill="#f6e28a" opacity={0.4 + sp * 0.3} />
          <circle cx="10" cy="1" r={sp * 1.6} fill="#fff2b0" opacity={0.9} />
          {sp > 0.7 && (
            <>
              <rect x="4" y="-1" width="1" height="1" fill="#f6e28a" />
              <rect x="15" y="0" width="1" height="1" fill="#f6e28a" />
            </>
          )}
        </>
      )}

      {/* pies (asoman bajo el hábito al caminar) */}
      <rect x={6 + (walk?.lf ?? 0)} y="32" width="3" height="2" fill={OUTLINE} />
      <rect x={11 + (walk?.rf ?? 0)} y="32" width="3" height="2" fill={OUTLINE} />

      {/* falda acampanada: pliegues y doble banda dorada (se mece al andar) */}
      <g transform={`translate(${hem} ${bob})`}>
        <rect x="3" y="22" width="14" height="10" fill={OUTLINE} />
        <rect x="4" y="22" width="12" height="9" fill={BLACK} />
        <rect x="6" y="22" width="8" height="9" fill={BLACK_DARK} />
        {/* pliegues verticales */}
        <rect x="7" y="22" width="1" height="8" fill={BLACK} />
        <rect x="12" y="22" width="1" height="8" fill={BLACK} />
        {/* doble banda dorada del dobladillo */}
        <rect x="4" y="29" width="12" height="1" fill={GOLD} />
        <rect x="4" y="30" width="12" height="1" fill={GOLD_SH} />
      </g>

      {/* torso (respira en idle) */}
      <g transform={`translate(0 ${breath + bob})`}>
        <rect x="4" y="10" width="12" height="12" fill={OUTLINE} />
        <rect x="5" y="11" width="10" height="11" fill={BLACK} />
        <rect x="7" y="11" width="6" height="11" fill={BLACK_DARK} />
        {/* brillo de hombros */}
        <rect x="5" y="11" width="10" height="1" fill={BLACK_HI} />
        {/* cuello blanco en V */}
        <rect x="8" y="11" width="4" height="1" fill={WHITE} />
        <rect x="9" y="12" width="2" height="1" fill={WHITE_SH} />
        {/* cruz dorada al pecho */}
        <rect x="9" y="13" width="1" height="3" fill={GOLD} />
        <rect x="8" y="14" width="3" height="1" fill={GOLD} />
        {/* cíngulo dorado */}
        <rect x="6" y="20" width="8" height="1" fill={GOLD} />

        {/* manos según el estado */}
        {state === "special" ? (
          // ritual: ambas manos elevadas, suben con la secuencia
          <>
            <rect x="3" y={12 - sp * 5} width="2" height="2" fill={SKIN} />
            <rect x="15" y={12 - sp * 5} width="2" height="2" fill={SKIN} />
          </>
        ) : state === "attack" ? (
          // bendición proyectada: el brazo se extiende y sale el destello
          <>
            <rect x={15 + atk * 3} y="14" width="2" height="2" fill={SKIN} />
            {atk > 0.6 && <circle cx={19 + atk * 3} cy="15" r={1.1} fill="#ffe066" />}
            <rect x="7" y="17" width="3" height="2" fill={SKIN} />
          </>
        ) : dialog ? (
          // diálogo: una mano gesticula, la otra queda recogida
          <>
            <rect x="15" y={dialog.handY + 6} width="2" height="2" fill={SKIN} />
            <rect x="7" y="17" width="3" height="2" fill={SKIN} />
          </>
        ) : (
          // idle/walk: manos recogidas al frente, con sombra
          <>
            <rect x="7" y="17" width="6" height="2" fill={SKIN} />
            <rect x="7" y="18" width="6" height="1" fill={SKIN_SH2} />
          </>
        )}

        {/* cabeza con velo y cofia (ligera inclinación al dialogar) */}
        <g transform={dialog ? `rotate(${dialog.tilt} 10 5)` : undefined}>
          {/* silueta del velo + caídas laterales */}
          <rect x="4" y="0" width="12" height="10" fill={OUTLINE} />
          <rect x="3" y="4" width="2" height="14" fill={OUTLINE} />
          <rect x="15" y="4" width="2" height="14" fill={OUTLINE} />
          {/* velo negro con brillo superior */}
          <rect x="5" y="1" width="10" height="3" fill={BLACK} />
          <rect x="5" y="1" width="10" height="1" fill={BLACK_HI} />
          <rect x="4" y="5" width="1" height="12" fill={BLACK} />
          <rect x="15" y="5" width="1" height="12" fill={BLACK} />
          {/* cofia blanca con sombra inferior */}
          <rect x="5" y="4" width="10" height="5" fill={WHITE} />
          <rect x="5" y="8" width="10" height="1" fill={WHITE_SH} />
          {/* rostro */}
          <rect x="7" y="5" width="6" height="4" fill={SKIN} />
          <rect x="7" y="5" width="6" height="1" fill={SKIN_SH2} />
          <rect x="8" y="6" width="1" height="2" fill="#232330" />
          <rect x="11" y="6" width="1" height="2" fill="#232330" />
          <rect x="9" y="8" width="2" height="1" fill={SKIN_SH2} />
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
    <div className="relative w-full aspect-[20/34] mt-0.5">
      <div className="sprite-shadow" />
      <NunSprite state={state} frame={frame} />
    </div>
  );
}
