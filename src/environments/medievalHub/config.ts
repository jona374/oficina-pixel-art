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
  width: 1456,
  height: 1080,
  /** Altura visible objetivo del personaje, como % de la ALTURA de la
   *  imagen. Un solo número controla la escala de todo el elenco. */
  charHeightPct: 9,
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
  /** Solo para kind "cast": id del módulo y su animación idle. */
  castId?: string;
  idleClass?: string;
  /** Solo para kind "sheet": clave del config del personaje. */
  sheetKey?: "samurai" | "minotaur" | "wizard";
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
  // — Protagonista, zona central junto a la mesa —
  {
    id: "jarvis", kind: "jarvis", label: "Jarvis", color: "#62ff8e",
    vw: 22, vh: 34, home: { x: 47, y: 71 },
    pois: [{ x: 40, y: 67 }, { x: 55, y: 73 }, { x: 48, y: 63 }],
    minRest: 8000, maxRest: 16000,
  },
  // — Oracle en la zona de estudio (derecha) —
  {
    id: "oracle", kind: "oracle", label: "Oracle", color: "#c9a0ff",
    vw: 28, vh: 44, home: { x: 70, y: 57 },
    pois: [{ x: 65, y: 61 }, { x: 73, y: 52 }],
    minRest: 12000, maxRest: 26000,
  },
  // — Free Knight, guardia junto a la entrada / rack de armas —
  {
    id: "knight", kind: "knight", label: "Knight", color: "#c9cede",
    vw: 38, vh: 42, home: { x: 33, y: 73 },
    pois: [{ x: 41, y: 75 }, { x: 30, y: 67 }],
    minRest: 9000, maxRest: 20000,
  },
  // — Samurai —
  {
    id: "samurai", kind: "sheet", sheetKey: "samurai", label: "Samurai", color: "#e0736a",
    vw: 128, vh: 72, home: { x: 58, y: 64 },
    pois: [{ x: 52, y: 59 }, { x: 62, y: 67 }],
    minRest: 9000, maxRest: 19000,
  },
  // — Wizard, junto a la barra / estanterías (izquierda) —
  {
    id: "wizard", kind: "sheet", sheetKey: "wizard", label: "Wizard", color: "#7ea8e0",
    vw: 103, vh: 68, home: { x: 30, y: 63 },
    pois: [{ x: 35, y: 67 }, { x: 26, y: 70 }],
    minRest: 11000, maxRest: 24000,
  },
  // — Minotaur, zona baja abierta —
  {
    id: "minotaur", kind: "sheet", sheetKey: "minotaur", label: "Minotaur", color: "#c98a5a",
    vw: 81, vh: 95, home: { x: 51, y: 81 },
    pois: [{ x: 45, y: 77 }, { x: 57, y: 82 }],
    minRest: 12000, maxRest: 26000,
  },
  // — Módulos del sistema (mismos sprites, ahora habitantes libres) —
  {
    id: "memory", kind: "cast", castId: "memory", idleClass: "anim-sort",
    label: "Memory", color: "#f6c85f", vw: 22, vh: 24, home: { x: 25, y: 64 },
    pois: [{ x: 30, y: 61 }, { x: 24, y: 69 }], minRest: 10000, maxRest: 22000,
  },
  {
    id: "status", kind: "cast", castId: "status", idleClass: "anim-scan",
    label: "Status", color: "#62ff8e", vw: 22, vh: 24, home: { x: 63, y: 54 },
    pois: [{ x: 58, y: 51 }, { x: 66, y: 57 }], minRest: 10000, maxRest: 22000,
  },
  {
    id: "tools", kind: "cast", castId: "tools", idleClass: "anim-tinker",
    label: "Tools", color: "#e08a60", vw: 22, vh: 24, home: { x: 38, y: 78 },
    pois: [{ x: 44, y: 73 }, { x: 34, y: 80 }], minRest: 10000, maxRest: 22000,
  },
  {
    id: "browser", kind: "cast", castId: "browser", idleClass: "anim-read",
    label: "Browser", color: "#60a5e0", vw: 22, vh: 24, home: { x: 67, y: 66 },
    pois: [{ x: 62, y: 61 }, { x: 70, y: 69 }], minRest: 10000, maxRest: 22000,
  },
  {
    id: "openclaw", kind: "cast", castId: "openclaw", idleClass: "anim-command",
    label: "OpenClaw", color: "#b088e0", vw: 22, vh: 24, home: { x: 73, y: 49 },
    pois: [{ x: 68, y: 53 }, { x: 75, y: 45 }], minRest: 10000, maxRest: 22000,
  },
];

/** A dónde va Jarvis cuando ejecuta una tarea (running). */
export const JARVIS_ACTION_SPOT: Spot = { x: 48, y: 62 };
