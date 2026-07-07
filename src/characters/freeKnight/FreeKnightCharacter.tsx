"use client";

import { useEffect, useRef, useState } from "react";
import { FREE_KNIGHT_CONFIG, type KnightAnimName } from "./config";
import FreeKnightSprite from "./FreeKnightSprite";

type Props = {
  /** true mientras se desplaza por la oficina. */
  walking?: boolean;
  /** Dirección de la mirada. */
  facing?: "left" | "right";
};

/**
 * Controlador de animación del Free Knight: máquina de estados
 * idle / walk / turn. Cuando cambia la dirección reproduce TurnAround
 * una vez y luego continúa (walk o idle). El frame avanza con
 * (frame+1) % frames, así el ciclo nunca se congela.
 */
export default function FreeKnightCharacter({ walking, facing = "right" }: Props) {
  const [anim, setAnim] = useState<KnightAnimName>("idle");
  const [frame, setFrame] = useState(0);
  const prevFacing = useRef(facing);
  const turningUntil = useRef(0);

  // Detecta el cambio de dirección → dispara TurnAround.
  useEffect(() => {
    if (facing !== prevFacing.current) {
      prevFacing.current = facing;
      const turn = FREE_KNIGHT_CONFIG.animations.turn;
      turningUntil.current = Date.now() + (turn.frames / turn.fps) * 1000;
      setAnim("turn");
    }
  }, [facing]);

  // Estado base según movimiento (respeta el turn en curso).
  useEffect(() => {
    if (Date.now() < turningUntil.current) return;
    setAnim(walking ? "walk" : "idle");
  }, [walking]);

  // Reproductor de frames del estado actual.
  useEffect(() => {
    const def = FREE_KNIGHT_CONFIG.animations[anim];
    let f = 0;
    setFrame(0);
    const id = setInterval(() => {
      f += 1;
      if (f >= def.frames) {
        if (def.loop) {
          f = 0;
          setFrame(0);
        } else {
          clearInterval(id);
          // al terminar el turn, retoma walk/idle
          setAnim(walking ? "walk" : "idle");
        }
      } else {
        setFrame(f);
      }
    }, 1000 / def.fps);
    return () => clearInterval(id);
    // walking en deps para que al terminar el turn tome el estado correcto
  }, [anim, walking]);

  return <FreeKnightSprite anim={anim} frame={frame} facing={facing} />;
}

/** Deriva la dirección de mirada a partir del movimiento horizontal. */
export function useFacing(x: number): "left" | "right" {
  const prev = useRef(x);
  const facing = useRef<"left" | "right">("right");
  if (x < prev.current - 0.05) facing.current = "left";
  else if (x > prev.current + 0.05) facing.current = "right";
  prev.current = x;
  return facing.current;
}
