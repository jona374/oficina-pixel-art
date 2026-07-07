import { PixelGrid } from "./PixelSprite";
import type { ModuleId } from "@/types/agent";

/* ============================================================
   Elenco de NPCs por matriz de píxeles (22 de ancho).
   Dirección de arte compartida: contorno oscuro, 3 tonos por
   material, ojos de 2px — y una firma de silueta por personaje:
   - Memory:   lentes redondos + chaleco mostaza + carpeta
   - Status:   pelo en puntas + audífonos al cuello + tablet
   - Tools:    gorra con parche + overol naranja + llave inglesa
   - Browser:  coleta lateral + capucha con cordones + notas
   - OpenClaw: pelo engominado + traje morado + corbata + gafete
   Son más bajos que Jarvis y Oracle (jerarquía de protagonistas).
   ============================================================ */

const MEMORY_PALETTE: Record<string, string> = {
  O: "#1a1a28", H: "#6b4a2b", h: "#543a20", S: "#eec39a", s: "#cf9c72",
  K: "#20202c", G: "#2e2e40", W: "#efe9d8", w: "#d6cfba", V: "#d9a944",
  v: "#a97f2a", P: "#4a4a5e", p: "#37374a", B: "#3a3a4a",
};

const MEMORY_BODY: string[] = [
  "......OOOOOOOOOO......",
  ".....OHHHHHHHHHHO.....",
  "....OHHHHHHHHHHHHO....",
  "....OHhHHHHHHHHhHO....",
  "....OhhSSSSSSSShhO....",
  "....OSGGGGSSGGGGSO....",
  "....OSGKKGSSGKKGSO....",
  "....OSSSSSSSSSSSSO....",
  "....OSSSSSssSSSSSO....",
  ".....OOSSSSSSSSOO.....",
  "......OOOOOOOOOO......",
  "....OVVVWWWWWWVVVO....",
  "....OVVVWWWWWWVVVO....",
  "....OVVVWwWWwWVVVO....",
  "....OVvVWWWWWWVvVO....",
  "....SVvVWWWWWWVvVS....",
  "....OvvvWwWWwWvvvO....",
  "....OppppppppppppO....",
  "....OPPPPPOOPPPPPO....",
  "....OPpPPPOOPPPpPO....",
  "....OPPPPPOOPPPPPO....",
  "....OPpPPPOOPPPpPO....",
  "....OBBBBBOOBBBBBO....",
  "....OOOOOOOOOOOOOO....",
];

const STATUS_PALETTE: Record<string, string> = {
  O: "#1a1a28", D: "#23232e", d: "#15151e", S: "#eec39a", s: "#cf9c72",
  K: "#20202c", T: "#57c06a", t: "#3f9a4f", G: "#3a3a52", P: "#3f3f52",
  p: "#2d2d3e", B: "#3a3a4a",
};

const STATUS_BODY: string[] = [
  "....OO..OO..OO..OO....",
  "....ODDDDDDDDDDDDO....",
  "....ODDDDDDDDDDDDO....",
  "....ODdDDDDDDDDdDO....",
  "....OddSSSSSSSSddO....",
  "....OSSKKSSSSKKSSO....",
  "....OSSSSSSSSSSSSO....",
  "....OSSSSSssSSSSSO....",
  ".....OOSSSSSSSSOO.....",
  "......OOOOOOOOOO......",
  "....OGGTTTTTTTTGGO....",
  "....OTTTTTTTTTTTTO....",
  "....OTTTtTTTTtTTTO....",
  "....OTTTTTTTTTTTTO....",
  "....STtTTTTTTTTtTS....",
  "....OttttttttttttO....",
  "....OppppppppppppO....",
  "....OPPPPPOOPPPPPO....",
  "....OPpPPPOOPPPpPO....",
  "....OPPPPPOOPPPPPO....",
  "....OPpPPPOOPPPpPO....",
  "....OBBBBBOOBBBBBO....",
  "....OOOOOOOOOOOOOO....",
];

const TOOLS_PALETTE: Record<string, string> = {
  O: "#1a1a28", C: "#d87a50", c: "#b05a38", Y: "#ffd83d", h: "#d9b054",
  S: "#eec39a", s: "#cf9c72", K: "#20202c", W: "#efe9d8", A: "#d0603a",
  a: "#a8482a", B: "#3a3a4a",
};

const TOOLS_BODY: string[] = [
  "....OOOOOOOOOOOOOO....",
  "....OCCCCCCCCCCCCO....",
  "....OCCCCCYYCCCCCO....",
  "....OhhhhhhhhhhhhO....",
  "....OSSSSSSSSSSSSO....",
  "....OSSKKSSSSKKSSO....",
  "....OSSSSSSSSSSSSO....",
  "....OSSSSsssSSSSSO....",
  ".....OOSSSSSSSSOO.....",
  "......OOOOOOOOOO......",
  "....OWWAAWWWWAAWWO....",
  "....OWWAAWWWWAAWWO....",
  "....OAAAAAAAAAAAAO....",
  "....OAAaAAAAAAaAAO....",
  "....SAAAAAaaAAAAAS....",
  "....OaaaaaaaaaaaaO....",
  "....OAAAAAOOAAAAAO....",
  "....OAaAAAOOAAAaAO....",
  "....OAAAAAOOAAAAAO....",
  "....OAaAAAOOAAAaAO....",
  "....OBBBBBOOBBBBBO....",
  "....OOOOOOOOOOOOOO....",
];

const BROWSER_PALETTE: Record<string, string> = {
  O: "#1a1a28", H: "#9a5a30", h: "#7a4422", S: "#eec39a", s: "#cf9c72",
  K: "#20202c", U: "#4a8ac8", u: "#35689c", W: "#efe9d8", P: "#3d4a66",
  p: "#2c374e", B: "#3a3a4a",
};

const BROWSER_BODY: string[] = [
  "......OOOOOOOOOO......",
  ".....OHHHHHHHHHHO.....",
  "....OHHHHHHHHHHHHO....",
  "....OHhHHHHHHHHhHO....",
  "....OHHhSSSSSSSShO....",
  "....OSSKKSSSSKKSSO....",
  "....OSSSSSSSSSSSSO....",
  "....OSSSSSssSSSSSO....",
  ".....OOSSSSSSSSOO.....",
  "......OOOOOOOOOO......",
  "....OuuUUUUUUUUuuO....",
  "....OUUWUUUUUUWUUO....",
  "....OUUWUUUUUUWUUO....",
  "....OUUUUuuuuUUUUO....",
  "....SUUUUuUUuUUUUS....",
  "....OuuuuuuuuuuuuO....",
  "....OPPPPPOOPPPPPO....",
  "....OPpPPPOOPPPpPO....",
  "....OPPPPPOOPPPPPO....",
  "....OPpPPPOOPPPpPO....",
  "....OBBBBBOOBBBBBO....",
  "....OOOOOOOOOOOOOO....",
];

const OPENCLAW_PALETTE: Record<string, string> = {
  O: "#1a1a28", D: "#1e1e2a", L: "#3a3a52", d: "#14141c", S: "#eec39a",
  s: "#cf9c72", K: "#20202c", J: "#4a3f6e", j: "#372e52", W: "#efe9d8",
  T: "#b088e0", t: "#8a64c0", B: "#26262e",
};

const OPENCLAW_BODY: string[] = [
  "......OOOOOOOOOO......",
  ".....ODDDDDDDDDDO.....",
  "....ODLLDDDDDDDDDO....",
  "....ODDDDDDDDDDDDO....",
  "....ODdSSSSSSSSdDO....",
  "....OSSKKSSSSKKSSO....",
  "....OSSSSSSSSSSSSO....",
  "....OSSSSSssSSSSSO....",
  ".....OOSSSSSSSSOO.....",
  "......OOOOOOOOOO......",
  "....OJJJWWTTWWJJJO....",
  "....OJjJWWTTWWJjJO....",
  "....OJJJJWTTWJJJJO....",
  "....OJjJJWttWJJjJO....",
  "....SJJJJJttJJJJJS....",
  "....OjjjjjjjjjjjjO....",
  "....OJJJJJOOJJJJJO....",
  "....OJjJJJOOJJJjJO....",
  "....OJJJJJOOJJJJJO....",
  "....OJjJJJOOJJJjJO....",
  "....OBBBBBOOBBBBBO....",
  "....OOOOOOOOOOOOOO....",
];

type CastDef = {
  rows: string[];
  palette: Record<string, string>;
  /** Accesorio distintivo dibujado sobre la matriz. */
  accessory?: React.ReactNode;
};

const CAST: Record<string, CastDef> = {
  memory: {
    rows: MEMORY_BODY,
    palette: MEMORY_PALETTE,
    // carpeta amarilla bajo el brazo
    accessory: (
      <>
        <rect x="17" y="12" width="4" height="4" fill="#1a1a28" />
        <rect x="17.5" y="12.5" width="3" height="3" fill="#e9c766" />
        <rect x="17.5" y="12.5" width="3" height="0.8" fill="#c29a3a" />
      </>
    ),
  },
  status: {
    rows: STATUS_BODY,
    palette: STATUS_PALETTE,
    // tablet con métricas en la mano derecha
    accessory: (
      <>
        <rect x="17" y="12" width="4" height="5" fill="#1a1a28" />
        <rect x="17.5" y="12.5" width="3" height="4" fill="#2a2a3a" />
        <rect x="18" y="13" width="0.8" height="2" fill="#66f28a" />
        <rect x="19.2" y="13.8" width="0.8" height="1.2" fill="#f6c85f" />
      </>
    ),
  },
  tools: {
    rows: TOOLS_BODY,
    palette: TOOLS_PALETTE,
    // llave inglesa en la mano derecha
    accessory: (
      <>
        <rect x="18" y="10" width="1.4" height="6" fill="#9aa2b8" />
        <rect x="17.2" y="9.2" width="3" height="1.6" fill="#9aa2b8" />
        <rect x="17.9" y="9.5" width="1.6" height="1" fill="#3a3a4a" />
      </>
    ),
  },
  browser: {
    rows: BROWSER_BODY,
    palette: BROWSER_PALETTE,
    // coleta lateral + hoja de notas
    accessory: (
      <>
        <rect x="17" y="2" width="3" height="9" fill="#1a1a28" />
        <rect x="17.5" y="3" width="2" height="7" fill="#9a5a30" />
        <rect x="17.5" y="7" width="2" height="1" fill="#7a4422" />
        <rect x="17.5" y="13" width="3.4" height="4" fill="#ffffff" />
        <rect x="18" y="14" width="2.4" height="0.6" fill="#9aa2b8" />
        <rect x="18" y="15.2" width="2.4" height="0.6" fill="#9aa2b8" />
      </>
    ),
  },
  openclaw: {
    rows: OPENCLAW_BODY,
    palette: OPENCLAW_PALETTE,
    // gafete morado en la solapa
    accessory: (
      <>
        <rect x="6" y="11" width="2" height="2" fill="#b088e0" />
        <rect x="6.5" y="11.5" width="1" height="1" fill="#e8ddff" />
      </>
    ),
  },
};

/** Sprite de NPC del elenco, por id de módulo. */
export default function CastSprite({ id }: { id: ModuleId }) {
  const def = CAST[id];
  if (!def) return null;
  const h = def.rows.length;
  return (
    <svg
      viewBox={`0 0 22 ${h}`}
      className="w-full h-full pixelated"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <PixelGrid rows={def.rows} palette={def.palette} />
      {def.accessory}
    </svg>
  );
}
