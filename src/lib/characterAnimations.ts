/**
 * Sistema de animación por frames para personajes pixel-art.
 *
 * Cada estado define cuántos frames tiene, a qué velocidad se
 * reproduce y si cicla (loop) o se reproduce una vez y pasa a `next`.
 * El frame actual avanza con `(frame + 1) % frames`, así el ciclo se
 * reinicia solo y nunca queda congelado.
 *
 * Reutilizable: define un AnimSet por personaje y pásalo a
 * `useCharacterAnimation`.
 */

export type AnimState = "idle" | "walk" | "dialogue" | "special" | "attack";

export type AnimDef = {
  /** Cantidad de frames de la secuencia. */
  frames: number;
  /** Velocidad de reproducción (frames por segundo). */
  fps: number;
  /** true: cicla infinito mientras el estado siga activo. */
  loop: boolean;
  /** Estado al que pasa al terminar (solo si loop=false). */
  next?: AnimState;
};

export type AnimSet = Record<AnimState, AnimDef>;

/** Timings de la monja/sacerdotisa (Oracle).
 *  - idle lento (respiración), walk al doble para pasos fluidos,
 *  - dialogue intermedio, special ceremonial, attack rápido. */
export const NUN_ANIMATIONS: AnimSet = {
  idle: { frames: 4, fps: 4, loop: true },
  walk: { frames: 4, fps: 8, loop: true },
  dialogue: { frames: 4, fps: 5, loop: true },
  special: { frames: 6, fps: 6, loop: true },
  attack: { frames: 6, fps: 10, loop: false, next: "idle" },
};
