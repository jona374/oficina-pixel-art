"use client";

import { useEffect, useRef, useState } from "react";

export type TilePos = { tx: number; ty: number };

export type WandererConfig = {
  id: string;
  /** Posición base (su escritorio). */
  home: TilePos;
  /** Puntos de interés a los que puede caminar. */
  pois: TilePos[];
  /** Milisegundos mínimos entre paseos. */
  minRest?: number;
  /** Milisegundos máximos entre paseos. */
  maxRest?: number;
};

export type WandererState = {
  pos: TilePos;
  walking: boolean;
  /** true si está fuera de su escritorio (de paseo o caminando). */
  away: boolean;
};

const WALK_MS = 1500; // debe coincidir con la transición CSS .character-move
const DWELL_MIN = 2600;
const DWELL_MAX = 4800;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Simula la vida de la oficina: cada personaje se levanta de vez en
 * cuando, camina a un punto de interés (cafetera, impresora, librero…),
 * se queda un momento y regresa a su escritorio. Los ciclos son
 * aleatorios e independientes para que la oficina nunca se sincronice.
 */
export function useOfficeLife(
  wanderers: WandererConfig[],
  enabled: boolean
): Record<string, WandererState> {
  const [states, setStates] = useState<Record<string, WandererState>>(() =>
    Object.fromEntries(
      wanderers.map((w) => [w.id, { pos: w.home, walking: false, away: false }])
    )
  );
  // La config es estable en la práctica; la fijamos para no reiniciar ciclos.
  const configRef = useRef(wanderers);

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => mounted && fn(), ms);
      timers.push(t);
    };

    const set = (id: string, next: WandererState) =>
      setStates((s) => ({ ...s, [id]: next }));

    configRef.current.forEach((w, i) => {
      const minRest = w.minRest ?? 9000;
      const maxRest = w.maxRest ?? 22000;

      const cycle = () => {
        later(() => {
          const poi = w.pois[Math.floor(Math.random() * w.pois.length)];
          // caminar hacia el punto de interés
          set(w.id, { pos: poi, walking: true, away: true });
          later(() => {
            // llegó: pausa natural
            set(w.id, { pos: poi, walking: false, away: true });
            later(() => {
              // volver al escritorio
              set(w.id, { pos: w.home, walking: true, away: true });
              later(() => {
                set(w.id, { pos: w.home, walking: false, away: false });
                cycle();
              }, WALK_MS);
            }, rand(DWELL_MIN, DWELL_MAX));
          }, WALK_MS);
        }, rand(minRest, maxRest) + i * 1800); // escalonado inicial
      };
      cycle();
    });

    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
      // todos de vuelta a su escritorio al pausar
      setStates(
        Object.fromEntries(
          configRef.current.map((w) => [
            w.id,
            { pos: w.home, walking: false, away: false },
          ])
        )
      );
    };
  }, [enabled]);

  return states;
}
