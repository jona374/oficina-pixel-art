/**
 * Configuración del avatar Free Knight (pack FreeKnight_v1).
 * Sheets usados: Colour1/Outline/120x80_PNGSheets (el outline se lee
 * mejor sobre el piso de la oficina). Las animaciones de combate del
 * pack (_Attack, _Death, _Hit, _Roll, _WallClimb…) quedan registradas
 * como NO usadas: no se copian ni se reproducen en la oficina.
 */

export type KnightAnimName = "idle" | "run" | "turnAround" | "jump" | "fall";

export type KnightAnimDef = {
  file: string;
  frames: number;
  fps: number;
  loop: boolean;
};

export const FREE_KNIGHT_CONFIG: {
  name: string;
  basePath: string;
  frameWidth: number;
  frameHeight: number;
  /** Escala visual configurable (ancho en % del mapa). */
  mapWidthPct: number;
  defaultAnimation: KnightAnimName;
  animations: Record<KnightAnimName, KnightAnimDef>;
} = {
  name: "Free Knight",
  basePath: "/assets/characters/free-knight",
  frameWidth: 120,
  frameHeight: 80,
  mapWidthPct: 13,
  defaultAnimation: "idle",
  animations: {
    idle: { file: "_Idle.png", frames: 10, fps: 8, loop: true },
    // Run a 7fps: en una oficina camina, no corre.
    run: { file: "_Run.png", frames: 10, fps: 7, loop: true },
    turnAround: { file: "_TurnAround.png", frames: 3, fps: 8, loop: false },
    jump: { file: "_Jump.png", frames: 3, fps: 8, loop: false },
    fall: { file: "_Fall.png", frames: 3, fps: 8, loop: false },
  },
};
