"use client";

import { useEffect, useState } from "react";
import type { AnimSet, AnimState } from "@/lib/characterAnimations";

/**
 * Máquina de estados de animación por frames.
 *
 * - `requested` es el estado que la lógica del juego quiere (idle,
 *   walk, dialogue, special, attack). Al cambiar, la animación
 *   arranca desde el frame 0.
 * - Los estados con loop ciclan infinito: (frame + 1) % frames.
 * - Los estados sin loop se reproducen completos una vez y pasan
 *   automáticamente a `next` (idle por defecto) — nunca se congelan
 *   en el último frame.
 */
export function useCharacterAnimation(animations: AnimSet, requested: AnimState) {
  const [state, setState] = useState<AnimState>(requested);
  const [frame, setFrame] = useState(0);

  // El estado pedido por la lógica manda: transición inmediata y limpia.
  useEffect(() => {
    setState(requested);
    setFrame(0);
  }, [requested]);

  // Reproductor del estado actual.
  useEffect(() => {
    const def = animations[state];
    let f = 0;
    setFrame(0);
    const id = setInterval(() => {
      f += 1;
      if (f >= def.frames) {
        if (def.loop) {
          f = 0; // reinicio del ciclo, sin saltos
          setFrame(0);
        } else {
          clearInterval(id);
          setState(def.next ?? "idle"); // vuelve solo a idle
        }
      } else {
        setFrame(f);
      }
    }, 1000 / def.fps);
    return () => clearInterval(id);
  }, [state, animations]);

  return { state, frame };
}
