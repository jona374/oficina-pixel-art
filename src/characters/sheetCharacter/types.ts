import { adultBoxWidthPct } from "../scale";

/**
 * Sistema genérico de personajes por spritesheet PNG (horizontal).
 * Reutilizable para cualquier pack: se define un SheetCharacterConfig
 * con el recorte real del personaje y las animaciones, y el tamaño en
 * el mapa se deriva de la escala estándar de adultos.
 */

export type SheetAnimName = "idle" | "walk";

export type SheetAnimDef = {
  file: string;
  frames: number;
  fps: number;
  loop: boolean;
};

export type SheetCharacterConfig = {
  id: string;
  name: string;
  /** Carpeta en /public con los PNG. */
  basePath: string;
  frameWidth: number;
  frameHeight: number;
  /** Ventana de recorte del personaje dentro del frame (px), centrada
   *  en el personaje para que el volteo no lo desplace. */
  crop: { x: number; y: number; w: number; h: number };
  labelColor: string;
  animations: Record<SheetAnimName, SheetAnimDef>;
};

/** Ancho de caja en % del mapa según la escala estándar de adultos. */
export function sheetMapWidthPct(cfg: SheetCharacterConfig): number {
  return adultBoxWidthPct(cfg.crop.w, cfg.crop.h);
}
