/**
 * Entorno principal: Medieval Fantasy Hub.
 * La imagen de la habitación isométrica se usa como fondo; los
 * personajes viven encima en coordenadas en % sobre la imagen.
 *
 * Para cambiar el fondo, reemplaza el PNG en `image` (mismas
 * proporciones idealmente). `width`/`height` definen el aspecto del
 * lienzo — ajústalos al tamaño real de tu imagen.
 */
export const MEDIEVAL_HUB = {
  image: "/assets/environments/medieval-hub/medieval-hub.png",
  width: 1448,
  height: 1086,
  /** Altura visible objetivo del personaje, como % de la ALTURA de la
   *  imagen. Un solo número controla la escala de todo el elenco. */
  charHeightPct: 8.5,
};

/** Punto en % sobre la imagen (0-100). */
export type Spot = { x: number; y: number };

export type HabitantKind = "jarvis" | "oracle" | "knight" | "sheet" | "cast";

export type HabitantDef = {
  id: string;
  kind: HabitantKind;
  label: string;
  color: string;
  /** Aspecto visible del sprite (para calcular el ancho a partir de la
   *  altura estándar). */
  vw: number;
  vh: number;
  home: Spot;
  pois: Spot[];
  minRest: number;
  maxRest: number;
  /** Velocidad de control manual (%/seg). Modular por personaje. */
  moveSpeed?: number;
  /** Solo para kind "cast": id del módulo y su animación idle. */
  castId?: string;
  idleClass?: string;
  /** Solo para kind "sheet": clave del config del personaje. */
  sheetKey?: "samurai" | "minotaur" | "wizard" | "marina";
};

/**
 * Ancho del contenedor (en % del ANCHO de la imagen) para lograr la
 * altura estándar, dado el aspecto visible del sprite. Así todos los
 * personajes quedan de la misma altura sin importar su silueta.
 */
export function habitantWidthPct(vw: number, vh: number): number {
  return MEDIEVAL_HUB.charHeightPct * (MEDIEVAL_HUB.height / MEDIEVAL_HUB.width) * (vw / vh);
}

/* ===== Elenco y sus zonas en la taberna =====
 * Coordenadas leídas sobre la imagen de referencia (piso de madera y
 * alfombras). Cada personaje ronda su zona para no amontonarse. */
export const HABITANTS: HabitantDef[] = [
  // ── Banda del fondo (zona de estudio / centro-derecha) ──
  {
    id: "status", kind: "cast", castId: "status", idleClass: "anim-scan",
    label: "Status", color: "#62ff8e", vw: 22, vh: 24, home: { x: 58, y: 60 },
    pois: [{ x: 55, y: 63 }, { x: 61, y: 57 }], minRest: 10000, maxRest: 22000,
  },
  {
    id: "openclaw", kind: "cast", castId: "openclaw", idleClass: "anim-command",
    label: "OpenClaw", color: "#b088e0", vw: 22, vh: 24, home: { x: 70, y: 57 },
    pois: [{ x: 67, y: 60 }, { x: 72, y: 53 }], minRest: 10000, maxRest: 22000,
  },
  {
    id: "oracle", kind: "oracle", label: "Oracle", color: "#c9a0ff",
    vw: 28, vh: 44, home: { x: 66, y: 63 },
    pois: [{ x: 62, y: 66 }, { x: 69, y: 59 }],
    minRest: 12000, maxRest: 26000,
  },
  // ── Banda media (piso principal, de izquierda a derecha) ──
  {
    id: "wizard", kind: "sheet", sheetKey: "wizard", label: "Wizard", color: "#7ea8e0",
    vw: 103, vh: 68, home: { x: 27, y: 70 },
    pois: [{ x: 32, y: 67 }, { x: 25, y: 74 }],
    minRest: 11000, maxRest: 24000,
  },
  {
    id: "memory", kind: "cast", castId: "memory", idleClass: "anim-sort",
    label: "Memory", color: "#f6c85f", vw: 22, vh: 24, home: { x: 36, y: 67 },
    pois: [{ x: 33, y: 71 }, { x: 39, y: 64 }], minRest: 10000, maxRest: 22000,
  },
  {
    id: "jarvis", kind: "jarvis", label: "Jarvis", color: "#62ff8e",
    vw: 22, vh: 34, home: { x: 47, y: 73 },
    pois: [{ x: 42, y: 70 }, { x: 51, y: 76 }, { x: 46, y: 66 }],
    minRest: 8000, maxRest: 16000,
  },
  {
    id: "samurai", kind: "sheet", sheetKey: "samurai", label: "Samurai", color: "#e0736a",
    vw: 128, vh: 72, home: { x: 57, y: 69 },
    pois: [{ x: 53, y: 66 }, { x: 60, y: 72 }],
    minRest: 9000, maxRest: 19000,
  },
  {
    id: "browser", kind: "cast", castId: "browser", idleClass: "anim-read",
    label: "Browser", color: "#60a5e0", vw: 22, vh: 24, home: { x: 66, y: 71 },
    pois: [{ x: 63, y: 68 }, { x: 68, y: 74 }], minRest: 10000, maxRest: 22000,
  },
  // — Marina (pack Free), piso abierto derecha-baja —
  {
    id: "marina", kind: "sheet", sheetKey: "marina", label: "Marina", color: "#8ec5ff",
    vw: 55, vh: 102, home: { x: 61, y: 78 },
    pois: [{ x: 57, y: 81 }, { x: 64, y: 75 }],
    minRest: 10000, maxRest: 22000,
  },
  // ── Banda del frente (entrada / zona baja) ──
  {
    id: "knight", kind: "knight", label: "Knight", color: "#c9cede",
    vw: 38, vh: 42, home: { x: 34, y: 81 },
    pois: [{ x: 39, y: 84 }, { x: 30, y: 77 }],
    minRest: 9000, maxRest: 20000,
  },
  {
    id: "tools", kind: "cast", castId: "tools", idleClass: "anim-tinker",
    label: "Tools", color: "#e08a60", vw: 22, vh: 24, home: { x: 43, y: 83 },
    pois: [{ x: 40, y: 79 }, { x: 46, y: 85 }], minRest: 10000, maxRest: 22000,
  },
  {
    id: "minotaur", kind: "sheet", sheetKey: "minotaur", label: "Minotaur", color: "#c98a5a",
    vw: 81, vh: 95, home: { x: 53, y: 85 },
    pois: [{ x: 49, y: 82 }, { x: 57, y: 86 }],
    minRest: 12000, maxRest: 26000,
  },
];

/** A dónde va Jarvis cuando ejecuta una tarea (running): la mesa central. */
export const JARVIS_ACTION_SPOT: Spot = { x: 46, y: 66 };
