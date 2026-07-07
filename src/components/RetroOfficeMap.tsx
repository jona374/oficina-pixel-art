import type { AgentStatus, ModuleId } from "@/types/agent";
import FloatingLabel from "./FloatingLabel";
import JarvisCharacter, { PixelPerson } from "./JarvisCharacter";

/* El mapa se modela en una cuadrícula de 20x14 "tiles" convertidos a
 * porcentajes. La sala está inset sobre un fondo oscuro, como un mapa
 * de juego de verdad. */
const GRID_W = 20;
const GRID_H = 14;
const px = (tx: number) => (tx / GRID_W) * 100;
const py = (ty: number) => (ty / GRID_H) * 100;

/* Geometría de la sala (paredes gruesas blancas) */
const ROOM = { x: 0.8, y: 0.8, w: 18.4, h: 12.6 }; // rectángulo exterior
const WALL = 0.6; // grosor de pared
const TOP_WALL = 1.0; // pared superior más gruesa (cuelgan ventanas/cuadros)
const DIV_X = 12.6; // división vertical de las salas derechas
const DIV_Y = 6.6; // división horizontal entre OpenClaw y Browser

type StationDef = {
  id: ModuleId;
  name: string;
  color: string;
  desk: { tx: number; ty: number };
  npc?: { hair: string; skin: string; shirt: string; pants: string };
  jarvisSpot: { tx: number; ty: number };
};

const STATIONS: StationDef[] = [
  {
    id: "memory",
    name: "Memory",
    color: "#f6c85f",
    desk: { tx: 2.5, ty: 3.9 },
    npc: { hair: "#5a3b1e", skin: "#e8b088", shirt: "#e0b060", pants: "#4a4a5a" },
    jarvisSpot: { tx: 5.0, ty: 4.7 },
  },
  {
    id: "status",
    name: "Status",
    color: "#62ff8e",
    desk: { tx: 7.6, ty: 3.6 },
    npc: { hair: "#222222", skin: "#c88a5a", shirt: "#5bc46a", pants: "#3a3a4a" },
    jarvisSpot: { tx: 10.1, ty: 4.4 },
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    color: "#b088e0",
    desk: { tx: 14.4, ty: 3.2 },
    npc: { hair: "#2a2a2a", skin: "#f0c8a0", shirt: "#8a6ad0", pants: "#3a3a4a" },
    jarvisSpot: { tx: 13.7, ty: 4.4 },
  },
  {
    id: "browser",
    name: "Browser",
    color: "#60a5e0",
    desk: { tx: 14.4, ty: 8.8 },
    npc: { hair: "#8a4a2a", skin: "#e8b088", shirt: "#4a8ac8", pants: "#4a4a5a" },
    jarvisSpot: { tx: 13.7, ty: 9.9 },
  },
  {
    id: "tools",
    name: "Tools",
    color: "#e08a60",
    desk: { tx: 7.6, ty: 10.0 },
    npc: { hair: "#c8a030", skin: "#f0c8a0", shirt: "#d87a50", pants: "#3a3a4a" },
    jarvisSpot: { tx: 10.1, ty: 10.8 },
  },
];

const JARVIS_DESK = { tx: 4.0, ty: 7.4 };
const JARVIS_HOME = { tx: 4.2, ty: 8.35 };

function jarvisPosition(status: AgentStatus): { x: number; y: number } {
  const spot =
    status.state === "running" && status.activeModule !== "jarvis"
      ? STATIONS.find((s) => s.id === status.activeModule)?.jarvisSpot ?? JARVIS_HOME
      : JARVIS_HOME;
  return { x: px(spot.tx), y: py(spot.ty) };
}

/* ===== Muebles pixel-art (SVG inline) ===== */

/** Escritorio con computadora retro beige, torre, teclado, taza y libro. */
function Desk({ active, wide }: { active?: boolean; wide?: boolean }) {
  return (
    <svg viewBox={wide ? "0 0 28 15" : "0 0 24 15"} className="w-full h-full pixelated" aria-hidden>
      {/* torre */}
      <rect x={wide ? 19 : 15} y="1" width="3.5" height="7" fill="#e3ddc9" />
      <rect x={wide ? 19 : 15} y="1" width="3.5" height="1" fill="#c9c2ab" />
      <rect x={wide ? 19.8 : 15.8} y="3" width="2" height="0.7" fill="#8a8a9a" />
      <rect x={wide ? 19.8 : 15.8} y="4.2" width="2" height="0.7" fill="#8a8a9a" />
      {/* monitor retro */}
      <rect x="6" y="0" width="8.5" height="7" fill="#e3ddc9" />
      <rect x="7" y="1" width="6.5" height="4.5" fill={active ? "var(--monitor-glow)" : "var(--monitor-dark)"} className={active ? "anim-screen" : undefined} />
      {active && <rect x="7.8" y="2" width="3" height="1" fill="#14532d" />}
      {!active && <rect x="7.8" y="2" width="4" height="0.8" fill="#4a6078" />}
      <rect x="9" y="7" width="2.5" height="0.8" fill="#c9c2ab" />
      {/* tablero */}
      <rect x="0" y="8" width={wide ? 28 : 24} height="3.4" fill="var(--wood-main)" />
      <rect x="0" y="10.6" width={wide ? 28 : 24} height="0.8" fill="var(--wood-shadow)" />
      {/* teclado + mouse */}
      <rect x="7" y="8.7" width="5.5" height="1.8" fill="#f0ece0" />
      <rect x="7.3" y="9" width="4.9" height="0.5" fill="#c9c2ab" />
      <rect x="13.5" y="9" width="1.3" height="1.3" fill="#f0ece0" />
      {/* taza */}
      <rect x={wide ? 24.5 : 20.5} y="8.5" width="2" height="2" fill="#e8e0d0" />
      <rect x={wide ? 24.9 : 20.9} y="8.9" width="1.2" height="0.8" fill="#8a5a3a" />
      {/* libro verde */}
      <rect x="1.5" y="8.5" width="3.5" height="2.2" fill="#5bc46a" />
      <rect x="1.5" y="8.5" width="3.5" height="0.6" fill="#3f8a4a" />
      {/* patas */}
      <rect x="1" y="11.4" width="2" height="3.4" fill="var(--wood-shadow)" />
      <rect x={wide ? 25 : 21} y="11.4" width="2" height="3.4" fill="var(--wood-shadow)" />
    </svg>
  );
}

/** Banquito de madera con ruedas (como la referencia). */
function Stool() {
  return (
    <svg viewBox="0 0 9 9" className="w-full h-full pixelated" aria-hidden>
      <rect x="1" y="1" width="7" height="4.5" fill="#d8a868" />
      <rect x="1" y="1" width="7" height="1" fill="#e8c088" />
      <rect x="1" y="4.5" width="7" height="1" fill="#a8783c" />
      <rect x="2" y="5.5" width="1.5" height="2" fill="#8a6236" />
      <rect x="5.5" y="5.5" width="1.5" height="2" fill="#8a6236" />
      {/* ruedas */}
      <rect x="2" y="7.5" width="1.5" height="1.2" fill="#3a3a4a" />
      <rect x="5.5" y="7.5" width="1.5" height="1.2" fill="#3a3a4a" />
    </svg>
  );
}

function Bookshelf() {
  return (
    <svg viewBox="0 0 16 15" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="16" height="15" fill="#8a6236" />
      <rect x="1" y="1" width="14" height="4" fill="#5c3d1e" />
      <rect x="1" y="6" width="14" height="4" fill="#5c3d1e" />
      <rect x="1" y="11" width="14" height="3" fill="#5c3d1e" />
      <rect x="2" y="1.5" width="2" height="3.5" fill="#5bc46a" />
      <rect x="4" y="2" width="2" height="3" fill="#ff5c7a" />
      <rect x="6" y="1.5" width="2" height="3.5" fill="#60a5e0" />
      <rect x="8" y="2.2" width="2" height="2.8" fill="#f6c85f" />
      <rect x="10" y="1.6" width="2" height="3.4" fill="#b088e0" />
      <rect x="2" y="7" width="2" height="3" fill="#f6c85f" />
      <rect x="4" y="6.5" width="2" height="3.5" fill="#b088e0" />
      <rect x="7" y="7" width="2" height="3" fill="#5bc46a" />
      <rect x="9" y="6.6" width="2" height="3.4" fill="#ff5c7a" />
      <rect x="12" y="7" width="2" height="3" fill="#60a5e0" />
      <rect x="2" y="11.6" width="4" height="2.4" fill="#c99b5d" />
      <rect x="10" y="11.2" width="2" height="1.4" fill="#5bc46a" />
      <rect x="10.4" y="12.6" width="1.2" height="1.4" fill="#b06a3a" />
    </svg>
  );
}

function FileCabinet() {
  return (
    <svg viewBox="0 0 8 12" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="8" height="12" fill="#7a7a8c" />
      <rect x="1" y="1" width="6" height="3" fill="#9a9aac" />
      <rect x="1" y="5" width="6" height="3" fill="#9a9aac" />
      <rect x="1" y="9" width="6" height="2" fill="#9a9aac" />
      <rect x="3" y="2" width="2" height="1" fill="#4a4a5a" />
      <rect x="3" y="6" width="2" height="1" fill="#4a4a5a" />
      <rect x="3" y="9.5" width="2" height="1" fill="#4a4a5a" />
    </svg>
  );
}

function Whiteboard() {
  return (
    <svg viewBox="0 0 18 9" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="18" height="9" fill="#8f6338" />
      <rect x="1" y="1" width="16" height="7" fill="#f8f6ee" />
      <rect x="2" y="2" width="6" height="1" fill="#5bc46a" />
      <rect x="2" y="4" width="4" height="1" fill="#6e5a9e" />
      <rect x="2" y="6" width="5" height="1" fill="#ff5c7a" />
      <rect x="10" y="2" width="5" height="4" fill="none" stroke="#60a5e0" strokeWidth="0.6" />
      <rect x="11" y="3" width="3" height="1" fill="#60a5e0" />
    </svg>
  );
}

function PictureFrame() {
  return (
    <svg viewBox="0 0 9 11" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="9" height="11" fill="#8f6338" />
      <rect x="1" y="1" width="7" height="9" fill="#e8f0e0" />
      <rect x="1.5" y="5.5" width="6" height="4" fill="#7ab87a" />
      <rect x="1.5" y="1.5" width="6" height="4.5" fill="#a8d8e8" />
      <rect x="3" y="3" width="3" height="3" fill="#5a9a5a" />
    </svg>
  );
}

function Sofa() {
  return (
    <svg viewBox="0 0 22 10" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="22" height="4" fill="#5a4a8a" />
      <rect x="0" y="3" width="3" height="6" fill="#5a4a8a" />
      <rect x="19" y="3" width="3" height="6" fill="#5a4a8a" />
      <rect x="3" y="4" width="16" height="4" fill="#7a68b0" />
      <rect x="3" y="4" width="8" height="4" fill="#6e5aa0" />
      <rect x="1" y="9" width="2" height="1" fill="#3a2f5c" />
      <rect x="19" y="9" width="2" height="1" fill="#3a2f5c" />
    </svg>
  );
}

function LowTable() {
  return (
    <svg viewBox="0 0 12 7" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="1" width="12" height="3" fill="var(--wood-main)" />
      <rect x="0" y="3" width="12" height="1" fill="var(--wood-shadow)" />
      <rect x="1" y="4" width="1" height="3" fill="var(--wood-shadow)" />
      <rect x="10" y="4" width="1" height="3" fill="var(--wood-shadow)" />
      <rect x="5" y="0" width="2" height="1.6" fill="#e8e0d0" />
    </svg>
  );
}

function Plant() {
  return (
    <svg viewBox="0 0 10 14" className="w-full h-full pixelated anim-sway" aria-hidden>
      <rect x="4" y="2" width="2" height="5" fill="#3f8a4a" />
      <rect x="2" y="0" width="2" height="4" fill="#5bc46a" />
      <rect x="6" y="1" width="2" height="3" fill="#5bc46a" />
      <rect x="1" y="4" width="3" height="2" fill="#3f8a4a" />
      <rect x="6" y="4" width="3" height="2" fill="#3f8a4a" />
      <rect x="3" y="8" width="4" height="4" fill="#b06a3a" />
      <rect x="2" y="7" width="6" height="2" fill="#c87a42" />
    </svg>
  );
}

function WallClock() {
  return (
    <svg viewBox="0 0 10 10" className="w-full h-full pixelated" aria-hidden>
      <circle cx="5" cy="5" r="4.5" fill="#eef0f4" stroke="#9aa2b8" strokeWidth="0.8" />
      <rect x="4.6" y="2" width="0.8" height="3.2" fill="#333" />
      <rect x="5" y="4.6" width="2.2" height="0.8" fill="#333" />
    </svg>
  );
}

function OfficeWindow() {
  return (
    <svg viewBox="0 0 16 9" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="16" height="9" fill="#b09468" />
      <rect x="1" y="1" width="6" height="7" fill="#aee0f0" />
      <rect x="9" y="1" width="6" height="7" fill="#aee0f0" />
      <rect x="2" y="1" width="1.4" height="7" fill="#e0f6fe" />
      <rect x="10" y="1" width="1.4" height="7" fill="#e0f6fe" />
    </svg>
  );
}

function WaterCooler() {
  return (
    <svg viewBox="0 0 8 14" className="w-full h-full pixelated" aria-hidden>
      <rect x="1" y="0" width="6" height="5" fill="#a8d8e8" />
      <rect x="2" y="1" width="2" height="3" fill="#d8f0f8" />
      <rect x="0" y="5" width="8" height="8" fill="#e8e6dc" />
      <rect x="2" y="6" width="4" height="2" fill="#3a3a4a" />
    </svg>
  );
}

function TrashCan() {
  return (
    <svg viewBox="0 0 7 9" className="w-full h-full pixelated" aria-hidden>
      <rect x="0.5" y="1.5" width="6" height="7" fill="#8a8a9a" />
      <rect x="1.2" y="2.2" width="4.6" height="5.6" fill="#a5a5b5" />
      <rect x="0" y="0.5" width="7" height="1.4" fill="#6a6a7a" />
    </svg>
  );
}

function Printer() {
  return (
    <svg viewBox="0 0 14 12" className="w-full h-full pixelated" aria-hidden>
      {/* mesita */}
      <rect x="0" y="8" width="14" height="2.4" fill="var(--wood-main)" />
      <rect x="0" y="9.6" width="14" height="0.8" fill="var(--wood-shadow)" />
      <rect x="1" y="10.4" width="1.4" height="1.6" fill="var(--wood-shadow)" />
      <rect x="11.6" y="10.4" width="1.4" height="1.6" fill="var(--wood-shadow)" />
      {/* impresora */}
      <rect x="2" y="2" width="8" height="6" fill="#dcdce4" />
      <rect x="3" y="0.8" width="6" height="1.6" fill="#f4f4f8" />
      <rect x="3" y="4" width="6" height="1" fill="#3a3a4a" />
      <rect x="8.5" y="6" width="1" height="1" fill="#62ff8e" />
      {/* papel saliendo */}
      <rect x="10.5" y="3" width="2.5" height="3.5" fill="#ffffff" />
    </svg>
  );
}

/** Banca/mesa auxiliar oscura del borde inferior (como la referencia). */
function Bench() {
  return (
    <svg viewBox="0 0 20 6" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="20" height="4.4" fill="#b0855a" />
      <rect x="0" y="0" width="20" height="1" fill="#c99b5d" />
      <rect x="1.5" y="1.6" width="7" height="1.8" fill="#3a3a4a" />
      <rect x="11" y="1.6" width="6" height="1.8" fill="#3a3a4a" />
      <rect x="2" y="2" width="1" height="0.8" fill="#62ff8e" />
      <rect x="0" y="4.4" width="20" height="1.6" fill="#7a5230" />
    </svg>
  );
}

function CheckerMat() {
  return (
    <svg viewBox="0 0 14 8" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="14" height="8" fill="#d88aa8" />
      {[0, 2, 4, 6, 8, 10, 12].map((x) =>
        [0, 2, 4, 6].map((y) =>
          (x / 2 + y / 2) % 2 === 0 ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" fill="#f0c0d4" />
          ) : null
        )
      )}
    </svg>
  );
}

function CoffeeMachine() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute -top-1 left-[30%] flex gap-[3px]">
        <span className="anim-steam w-1 h-1 rounded-full bg-white/70" />
        <span className="anim-steam steam-2 w-1 h-1 rounded-full bg-white/70" />
        <span className="anim-steam steam-3 w-1 h-1 rounded-full bg-white/70" />
      </div>
      <svg viewBox="0 0 12 10" className="w-full h-full pixelated" aria-hidden>
        <rect x="0" y="8" width="12" height="2" fill="var(--wood-shadow)" />
        <rect x="1" y="0" width="6" height="8" fill="#4a4a5a" />
        <rect x="2" y="1" width="4" height="2" fill="#ff5c7a" />
        <rect x="3" y="5" width="2" height="2" fill="#e8e0d0" />
        <rect x="8" y="4" width="3" height="4" fill="#e8e0d0" />
      </svg>
    </div>
  );
}

/* ===== Piezas del mapa ===== */

/** Pared blanca gruesa con contorno y sombra proyectada al piso. */
function Wall({ tx, ty, tw, th }: { tx: number; ty: number; tw: number; th: number }) {
  return (
    <div
      className="absolute z-10"
      style={{
        left: `${px(tx)}%`,
        top: `${py(ty)}%`,
        width: `${px(tw)}%`,
        height: `${py(th)}%`,
        backgroundColor: "var(--pixel-wall)",
        boxShadow:
          "inset 0 -3px 0 var(--pixel-wall-shadow)," +
          "inset 0 1px 0 rgba(255,255,255,0.7)," +
          "0 0 0 1px var(--pixel-wall-outline)," +
          "0 4px 6px rgba(20,22,40,0.25)",
      }}
    />
  );
}

function Deco({
  tx,
  ty,
  tw,
  th,
  z = 5,
  children,
}: {
  tx: number;
  ty: number;
  tw: number;
  th: number;
  z?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${px(tx)}%`,
        top: `${py(ty)}%`,
        width: `${px(tw)}%`,
        height: `${py(th)}%`,
        zIndex: z,
      }}
    >
      {children}
    </div>
  );
}

function Rug({ color, border }: { color: string; border: string }) {
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: color,
        border: `3px solid ${border}`,
        boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.15)",
        borderRadius: 2,
      }}
    />
  );
}

function ModuleStation({
  station,
  isActive,
}: {
  station: StationDef;
  isActive: boolean;
}) {
  const { desk, npc, name, color, id } = station;
  const wide = id === "openclaw";
  return (
    <>
      <div
        className="absolute z-20 flex flex-col items-center"
        style={{ left: `${px(desk.tx + 0.6)}%`, top: `${py(desk.ty - 1.85)}%`, width: "5.5%" }}
      >
        <FloatingLabel name={name} color={color} blinking={isActive} />
        {npc && (
          <div className={`relative w-[72%] aspect-[12/14] mt-0.5 ${isActive ? "anim-walk" : ""}`}>
            <div className="sprite-shadow" />
            <PixelPerson {...npc} />
          </div>
        )}
      </div>
      <Deco tx={desk.tx} ty={desk.ty} tw={wide ? 3.1 : 2.7} th={1.75} z={15}>
        <Desk active={isActive} wide={wide} />
      </Deco>
      <Deco tx={desk.tx + 1.0} ty={desk.ty + 1.78} tw={0.72} th={0.72} z={6}>
        <Stool />
      </Deco>
    </>
  );
}

/* ===== Mapa principal ===== */

export default function RetroOfficeMap({ status }: { status: AgentStatus }) {
  const jarvis = jarvisPosition(status);
  const R = ROOM;

  return (
    <div
      className="crt-frame w-full"
      style={{ aspectRatio: `${GRID_W}/${GRID_H}`, backgroundColor: "var(--pixel-outside)" }}
    >
      {/* piso menta con cuadrícula y puntitos en las intersecciones */}
      <div
        className="absolute"
        style={{
          left: `${px(R.x)}%`,
          top: `${py(R.y)}%`,
          width: `${px(R.w)}%`,
          height: `${py(R.h)}%`,
          backgroundColor: "var(--pixel-floor)",
          backgroundImage:
            "linear-gradient(to right, var(--pixel-floor-line) 1px, transparent 1px)," +
            "linear-gradient(to bottom, var(--pixel-floor-line) 1px, transparent 1px)," +
            "radial-gradient(circle, var(--pixel-floor-line) 2px, transparent 2.5px)",
          backgroundSize: `${(100 / R.w)}% ${(100 / R.h)}%, ${(100 / R.w)}% ${(100 / R.h)}%, ${(100 / R.w)}% ${(100 / R.h)}%`,
          opacity: 1,
        }}
      />

      {/* piso de madera: despacho privado de OpenClaw */}
      <div
        className="absolute"
        style={{
          left: `${px(DIV_X + 0.5)}%`,
          top: `${py(R.y + TOP_WALL)}%`,
          width: `${px(R.x + R.w - WALL - DIV_X - 0.5)}%`,
          height: `${py(DIV_Y - R.y - TOP_WALL)}%`,
          backgroundColor: "#d3b389",
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(120,80,40,0.25) 0 1px, transparent 1px 13px)," +
            "repeating-linear-gradient(to right, rgba(120,80,40,0.12) 0 1px, transparent 1px 40px)",
          zIndex: 1,
        }}
      />

      {/* alfombras */}
      <Deco tx={3.3} ty={7.1} tw={3.6} th={2.9} z={2}>
        <Rug color="#d9c9a4" border="#bfae87" />
      </Deco>
      <Deco tx={13.5} ty={10.5} tw={2.3} th={1.2} z={2}>
        <Rug color="#b57272" border="#95575c" />
      </Deco>

      {/* luz de las ventanas */}
      <div
        className="light-shaft"
        style={{ left: `${px(6.9)}%`, top: `${py(1.8)}%`, width: `${px(1.9)}%`, height: `${py(3.4)}%`, zIndex: 3 }}
      />
      <div
        className="light-shaft"
        style={{ left: `${px(16.1)}%`, top: `${py(1.8)}%`, width: `${px(1.9)}%`, height: `${py(3.0)}%`, zIndex: 3 }}
      />

      {/* ===== paredes ===== */}
      {/* perímetro */}
      <Wall tx={R.x} ty={R.y} tw={R.w} th={TOP_WALL} />
      <Wall tx={R.x} ty={R.y + R.h - WALL} tw={R.w} th={WALL} />
      <Wall tx={R.x} ty={R.y} tw={WALL} th={R.h} />
      <Wall tx={R.x + R.w - WALL} ty={R.y} tw={WALL} th={R.h} />
      {/* división vertical derecha (con puertas) */}
      <Wall tx={DIV_X} ty={R.y} tw={0.5} th={2.4} />
      <Wall tx={DIV_X} ty={5.0} tw={0.5} th={3.4} />
      <Wall tx={DIV_X} ty={10.2} tw={0.5} th={R.y + R.h - 10.2} />
      {/* división horizontal entre OpenClaw y Browser (hueco a la derecha) */}
      <Wall tx={DIV_X} ty={DIV_Y} tw={4.6} th={0.55} />
      <Wall tx={18.0} ty={DIV_Y} tw={1.2} th={0.55} />

      {/* ===== decoración pared superior ===== */}
      <Deco tx={1.35} ty={0.95} tw={1.7} th={1.5} z={12}>
        <CoffeeMachine />
      </Deco>
      <Deco tx={3.6} ty={0.95} tw={1.9} th={0.9} z={12}>
        <Whiteboard />
      </Deco>
      <Deco tx={5.9} ty={1.0} tw={0.8} th={0.75} z={12}>
        <WallClock />
      </Deco>
      <Deco tx={7.0} ty={0.9} tw={1.7} th={0.9} z={12}>
        <OfficeWindow />
      </Deco>
      <Deco tx={16.2} ty={0.9} tw={1.7} th={0.9} z={12}>
        <OfficeWindow />
      </Deco>
      <Deco tx={13.3} ty={0.95} tw={0.85} th={1.0} z={12}>
        <PictureFrame />
      </Deco>
      <Deco tx={10.9} ty={1.1} tw={0.85} th={1.55} z={12}>
        <WaterCooler />
      </Deco>
      <Deco tx={10.1} ty={1.5} tw={0.62} th={0.85} z={12}>
        <TrashCan />
      </Deco>

      {/* decoración sala Browser */}
      <Deco tx={13.3} ty={6.75} tw={0.85} th={1.0} z={12}>
        <PictureFrame />
      </Deco>
      <Deco tx={17.3} ty={6.85} tw={0.8} th={0.75} z={12}>
        <WallClock />
      </Deco>

      {/* mobiliario general */}
      <Deco tx={1.55} ty={2.75} tw={0.75} th={1.25} z={6}>
        <FileCabinet />
      </Deco>
      <Deco tx={1.5} ty={5.6} tw={1.5} th={1.55} z={6}>
        <Bookshelf />
      </Deco>
      <Deco tx={2.6} ty={11.0} tw={2.3} th={1.15} z={6}>
        <Sofa />
      </Deco>
      <Deco tx={5.2} ty={11.3} tw={1.25} th={0.8} z={6}>
        <LowTable />
      </Deco>
      <Deco tx={1.5} ty={9.3} tw={0.9} th={1.4} z={6}>
        <Plant />
      </Deco>
      <Deco tx={17.6} ty={5.15} tw={0.9} th={1.4} z={6}>
        <Plant />
      </Deco>
      <Deco tx={17.6} ty={7.5} tw={0.9} th={1.4} z={6}>
        <Plant />
      </Deco>
      <Deco tx={11.7} ty={11.6} tw={0.9} th={1.4} z={6}>
        <Plant />
      </Deco>
      {/* impresora junto a la cafetería */}
      <Deco tx={8.9} ty={10.9} tw={1.5} th={1.3} z={6}>
        <Printer />
      </Deco>
      {/* bancas del borde inferior */}
      <Deco tx={1.6} ty={12.15} tw={2.2} th={0.66} z={11}>
        <Bench />
      </Deco>
      <Deco tx={6.4} ty={12.15} tw={2.2} th={0.66} z={11}>
        <Bench />
      </Deco>
      {/* tapete ajedrezado en la entrada */}
      <Deco tx={14.7} ty={12.0} tw={1.5} th={0.85} z={4}>
        <CheckerMat />
      </Deco>

      {/* escritorio personal de Jarvis */}
      <Deco tx={JARVIS_DESK.tx} ty={JARVIS_DESK.ty} tw={2.7} th={1.75} z={15}>
        <Desk active={status.state !== "disconnected"} />
      </Deco>
      <Deco tx={JARVIS_DESK.tx + 1.0} ty={JARVIS_DESK.ty + 1.78} tw={0.72} th={0.72} z={6}>
        <Stool />
      </Deco>

      {/* estaciones de módulos */}
      {STATIONS.map((s) => (
        <ModuleStation
          key={s.id}
          station={s}
          isActive={status.state === "running" && status.activeModule === s.id}
        />
      ))}

      {/* Jarvis */}
      <JarvisCharacter state={status.state} x={jarvis.x} y={jarvis.y} />

      {/* viñeta + LED */}
      <div className="map-vignette" />
      <div className="crt-led" />
    </div>
  );
}
