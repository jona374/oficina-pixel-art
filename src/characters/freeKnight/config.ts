/**
 * Configuración del avatar Free Knight (pack FreeKnight_v1).
 * Sheets: Colour1/Outline/120x80_PNGSheets.
 *
 * El personaje visible ocupa solo ~30x39 px dentro de cada frame de
 * 120x80 (medido: Idle x[44-64] y[42-79], Run x[41-70] y[41-79]),
 * centrado en x≈57 con los pies en la base. Por eso definimos una
 * VENTANA DE RECORTE que enfoca al personaje: así se ve grande y
 * nítido sin tocar el asset. Los sprites de combate del pack quedan
 * registrados pero NO se usan en la oficina.
 */

import { adultBoxWidthPct } from "../scale";

export type KnightAnimName = "idle" | "walk" | "turn" | "jump" | "fall";

export type KnightAnimDef = {
  file: string;
  frames: number;
  fps: number;
  loop: boolean;
};

/** Recorte del personaje dentro del frame (px). Centrado en x≈57 para
 *  que el volteo horizontal no lo desplace. */
export const KNIGHT_CROP = { x: 38, y: 38, w: 38, h: 42 };

export const FREE_KNIGHT_CONFIG: {
  name: string;
  basePath: string;
  frameWidth: number;
  frameHeight: number;
  crop: { x: number; y: number; w: number; h: number };
  /** Ancho del personaje recortado en % del mapa (ajústalo aquí). */
  mapWidthPct: number;
  defaultAnimation: KnightAnimName;
  animations: Record<KnightAnimName, KnightAnimDef>;
} = {
  name: "Free Knight",
  basePath: "/assets/characters/free-knight",
  frameWidth: 120,
  frameHeight: 80,
  crop: KNIGHT_CROP,
  // Tamaño derivado de la escala estándar de adultos (altura visible
  // objetivo), calculado desde el recorte real del personaje.
  // = 9.7 * (38/42) ≈ 8.78 (~+17% respecto al 7.5 anterior).
  mapWidthPct: adultBoxWidthPct(KNIGHT_CROP.w, KNIGHT_CROP.h),
  defaultAnimation: "idle",
  animations: {
    idle: { file: "_Idle.png", frames: 10, fps: 8, loop: true },
    // "Run" a 6fps: en una oficina camina, no corre.
    walk: { file: "_Run.png", frames: 10, fps: 6, loop: true },
    turn: { file: "_TurnAround.png", frames: 3, fps: 9, loop: false },
    jump: { file: "_Jump.png", frames: 3, fps: 8, loop: false },
    fall: { file: "_Fall.png", frames: 3, fps: 8, loop: false },
  },
};
