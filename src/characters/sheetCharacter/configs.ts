import type { SheetCharacterConfig } from "./types";

/**
 * Personajes de spritesheet integrados a la oficina (packs CraftPix,
 * variante Idle+Walk; las animaciones de combate quedan fuera).
 * Frames de 128x128. Recortes medidos por el bounding box real del
 * personaje, centrados en el idle. El tamaño se deriva de la escala
 * estándar de adultos (ver scale.ts).
 */

export const SAMURAI_CONFIG: SheetCharacterConfig = {
  id: "samurai",
  name: "Samurai",
  basePath: "/assets/characters/samurai",
  frameWidth: 128,
  frameHeight: 128,
  crop: { x: 0, y: 56, w: 128, h: 72 },
  labelColor: "#e0736a",
  animations: {
    idle: { file: "Idle.png", frames: 6, fps: 6, loop: true },
    walk: { file: "Walk.png", frames: 9, fps: 8, loop: true },
  },
};

export const MINOTAUR_CONFIG: SheetCharacterConfig = {
  id: "minotaur",
  name: "Minotaur",
  basePath: "/assets/characters/minotaur",
  frameWidth: 128,
  frameHeight: 128,
  crop: { x: 7, y: 33, w: 81, h: 95 },
  labelColor: "#c98a5a",
  animations: {
    idle: { file: "Idle.png", frames: 10, fps: 7, loop: true },
    walk: { file: "Walk.png", frames: 12, fps: 8, loop: true },
  },
};

export const WIZARD_CONFIG: SheetCharacterConfig = {
  id: "wizard",
  name: "Wizard",
  basePath: "/assets/characters/wizard",
  frameWidth: 128,
  frameHeight: 128,
  crop: { x: 3, y: 60, w: 103, h: 68 },
  labelColor: "#7ea8e0",
  animations: {
    idle: { file: "Idle.png", frames: 8, fps: 6, loop: true },
    walk: { file: "Walk.png", frames: 7, fps: 8, loop: true },
  },
};

export const SHEET_CHARACTERS: SheetCharacterConfig[] = [
  SAMURAI_CONFIG,
  MINOTAUR_CONFIG,
  WIZARD_CONFIG,
];
