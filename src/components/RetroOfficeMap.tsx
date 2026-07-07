import type { AgentStatus, ModuleId } from "@/types/agent";
import FloatingLabel from "./FloatingLabel";
import JarvisCharacter, { PixelPerson } from "./JarvisCharacter";

/* El mapa se modela en una cuadrícula de 18x13 "tiles" convertidos a
 * porcentajes, así todo escala con el contenedor. */
const GRID_W = 18;
const GRID_H = 13;
const px = (tx: number) => (tx / GRID_W) * 100;
const py = (ty: number) => (ty / GRID_H) * 100;

type StationDef = {
  id: ModuleId;
  name: string;
  color: string;
  desk: { tx: number; ty: number };
  npc?: { hair: string; skin: string; shirt: string; pants: string };
  /** Dónde se para Jarvis cuando trabaja con este módulo. */
  jarvisSpot: { tx: number; ty: number };
};

const STATIONS: StationDef[] = [
  {
    id: "memory",
    name: "Memory",
    color: "#e0b060",
    desk: { tx: 1.3, ty: 2.6 },
    npc: { hair: "#5a3b1e", skin: "#e8b088", shirt: "#e0b060", pants: "#4a4a5a" },
    jarvisSpot: { tx: 3.6, ty: 3.4 },
  },
  {
    id: "status",
    name: "Status",
    color: "#7ee787",
    desk: { tx: 6.8, ty: 2.6 },
    npc: { hair: "#222222", skin: "#c88a5a", shirt: "#5bc46a", pants: "#3a3a4a" },
    jarvisSpot: { tx: 9.1, ty: 3.4 },
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    color: "#b088e0",
    desk: { tx: 13.6, ty: 2.6 },
    npc: { hair: "#2a2a2a", skin: "#f0c8a0", shirt: "#8a6ad0", pants: "#3a3a4a" },
    jarvisSpot: { tx: 12.6, ty: 3.6 },
  },
  {
    id: "browser",
    name: "Browser",
    color: "#60a5e0",
    desk: { tx: 13.6, ty: 8.2 },
    npc: { hair: "#8a4a2a", skin: "#e8b088", shirt: "#4a8ac8", pants: "#4a4a5a" },
    jarvisSpot: { tx: 12.6, ty: 9.2 },
  },
  {
    id: "tools",
    name: "Tools",
    color: "#e08a60",
    desk: { tx: 6.8, ty: 9.4 },
    npc: { hair: "#c8a030", skin: "#f0c8a0", shirt: "#d87a50", pants: "#3a3a4a" },
    jarvisSpot: { tx: 9.1, ty: 10.2 },
  },
];

/** Escritorio del propio Jarvis (sin NPC). */
const JARVIS_DESK = { tx: 3.2, ty: 6.6 };
const JARVIS_HOME = { tx: 3.4, ty: 7.6 };

function jarvisPosition(status: AgentStatus): { x: number; y: number } {
  const spot =
    status.state === "running" && status.activeModule !== "jarvis"
      ? STATIONS.find((s) => s.id === status.activeModule)?.jarvisSpot ?? JARVIS_HOME
      : JARVIS_HOME;
  return { x: px(spot.tx), y: py(spot.ty) };
}

/* ===== Muebles pixel-art (SVG inline) ===== */

function Desk({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 22 13" className="w-full h-full pixelated" aria-hidden>
      {/* monitor */}
      <rect x="7" y="0" width="8" height="6" fill="#3a3a4a" />
      <rect
        x="8"
        y="1"
        width="6"
        height="4"
        fill={active ? "#7ee787" : "#5a7a9a"}
        className={active ? "anim-screen" : undefined}
      />
      {active && <rect x="9" y="2" width="3" height="1" fill="#16341e" />}
      <rect x="10" y="6" width="2" height="1" fill="#2a2a3a" />
      {/* tablero */}
      <rect x="0" y="7" width="22" height="3" fill="#c99a5b" />
      <rect x="0" y="9" width="22" height="1" fill="#8a6236" />
      {/* teclado y taza */}
      <rect x="8" y="7.5" width="5" height="1.5" fill="#e8e0d0" />
      <rect x="17" y="7" width="2" height="2" fill="#e8e0d0" />
      {/* libro */}
      <rect x="2" y="7" width="3" height="2" fill="#5bc46a" />
      {/* patas */}
      <rect x="1" y="10" width="2" height="3" fill="#8a6236" />
      <rect x="19" y="10" width="2" height="3" fill="#8a6236" />
    </svg>
  );
}

function Stool() {
  return (
    <svg viewBox="0 0 8 8" className="w-full h-full pixelated" aria-hidden>
      <rect x="1" y="1" width="6" height="4" fill="#d8a868" />
      <rect x="1" y="4" width="6" height="1" fill="#a8783c" />
      <rect x="1" y="5" width="1" height="3" fill="#8a6236" />
      <rect x="6" y="5" width="1" height="3" fill="#8a6236" />
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
      {/* libros fila 1 */}
      <rect x="2" y="1.5" width="2" height="3.5" fill="#5bc46a" />
      <rect x="4" y="2" width="2" height="3" fill="#e06060" />
      <rect x="6" y="1.5" width="2" height="3.5" fill="#60a5e0" />
      <rect x="8" y="2.2" width="2" height="2.8" fill="#e0b060" />
      <rect x="10" y="1.6" width="2" height="3.4" fill="#b088e0" />
      {/* libros fila 2 */}
      <rect x="2" y="7" width="2" height="3" fill="#e0b060" />
      <rect x="4" y="6.5" width="2" height="3.5" fill="#b088e0" />
      <rect x="7" y="7" width="2" height="3" fill="#5bc46a" />
      <rect x="9" y="6.6" width="2" height="3.4" fill="#e06060" />
      <rect x="12" y="7" width="2" height="3" fill="#60a5e0" />
      {/* fila 3: caja y planta pequeña */}
      <rect x="2" y="11.6" width="4" height="2.4" fill="#c99a5b" />
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
      <rect x="0" y="0" width="18" height="9" fill="#8a6236" />
      <rect x="1" y="1" width="16" height="7" fill="#f4f2ea" />
      {/* garabatos del plan */}
      <rect x="2" y="2" width="6" height="1" fill="#5bc46a" />
      <rect x="2" y="4" width="4" height="1" fill="#6e5a9e" />
      <rect x="2" y="6" width="5" height="1" fill="#e06060" />
      <rect x="10" y="2" width="5" height="4" fill="none" stroke="#60a5e0" strokeWidth="0.6" />
      <rect x="11" y="3" width="3" height="1" fill="#60a5e0" />
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
      <rect x="0" y="1" width="12" height="3" fill="#c99a5b" />
      <rect x="0" y="3" width="12" height="1" fill="#8a6236" />
      <rect x="1" y="4" width="1" height="3" fill="#8a6236" />
      <rect x="10" y="4" width="1" height="3" fill="#8a6236" />
      {/* tacita */}
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
      <rect x="1" y="1" width="8" height="8" fill="#e8e0d0" />
      <rect x="0" y="2" width="10" height="6" fill="#e8e0d0" />
      <rect x="4" y="2" width="1" height="3" fill="#333" />
      <rect x="5" y="5" width="2" height="1" fill="#333" />
    </svg>
  );
}

function OfficeWindow() {
  return (
    <svg viewBox="0 0 14 8" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="14" height="8" fill="#8a6236" />
      <rect x="1" y="1" width="5" height="6" fill="#a8d8e8" />
      <rect x="8" y="1" width="5" height="6" fill="#a8d8e8" />
      <rect x="2" y="1" width="1" height="6" fill="#d8f0f8" />
      <rect x="9" y="1" width="1" height="6" fill="#d8f0f8" />
    </svg>
  );
}

function WaterCooler() {
  return (
    <svg viewBox="0 0 8 14" className="w-full h-full pixelated" aria-hidden>
      <rect x="1" y="0" width="6" height="5" fill="#a8d8e8" />
      <rect x="2" y="1" width="2" height="3" fill="#d8f0f8" />
      <rect x="0" y="5" width="8" height="8" fill="#e8e0d0" />
      <rect x="2" y="6" width="4" height="2" fill="#3a3a4a" />
    </svg>
  );
}

function CoffeeMachine() {
  return (
    <div className="relative w-full h-full">
      {/* vapor animado */}
      <div className="absolute -top-1 left-[30%] flex gap-[3px]">
        <span className="anim-steam w-1 h-1 rounded-full bg-white/70" />
        <span className="anim-steam steam-2 w-1 h-1 rounded-full bg-white/70" />
        <span className="anim-steam steam-3 w-1 h-1 rounded-full bg-white/70" />
      </div>
      <svg viewBox="0 0 12 10" className="w-full h-full pixelated" aria-hidden>
        <rect x="0" y="8" width="12" height="2" fill="#8a6236" />
        <rect x="1" y="0" width="6" height="8" fill="#4a4a5a" />
        <rect x="2" y="1" width="4" height="2" fill="#e06060" />
        <rect x="3" y="5" width="2" height="2" fill="#e8e0d0" />
        <rect x="8" y="4" width="3" height="4" fill="#e8e0d0" />
      </svg>
    </div>
  );
}

function DoorMat() {
  return (
    <svg viewBox="0 0 12 6" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="0" width="12" height="6" fill="#c86a8a" />
      <rect x="1" y="1" width="2" height="1" fill="#e8a8c0" />
      <rect x="5" y="2" width="2" height="1" fill="#e8a8c0" />
      <rect x="9" y="1" width="2" height="1" fill="#e8a8c0" />
      <rect x="3" y="4" width="2" height="1" fill="#e8a8c0" />
      <rect x="7" y="4" width="2" height="1" fill="#e8a8c0" />
    </svg>
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

/* ===== Piezas del mapa ===== */

function Wall({ tx, ty, tw, th }: { tx: number; ty: number; tw: number; th: number }) {
  return (
    <div
      className="absolute bg-crt-beige z-10"
      style={{
        left: `${px(tx)}%`,
        top: `${py(ty)}%`,
        width: `${px(tw)}%`,
        height: `${py(th)}%`,
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.5)",
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

function ModuleStation({
  station,
  isActive,
}: {
  station: StationDef;
  isActive: boolean;
}) {
  const { desk, npc, name, color } = station;
  return (
    <>
      {/* etiqueta + NPC detrás del escritorio */}
      <div
        className="absolute z-20 flex flex-col items-center"
        style={{ left: `${px(desk.tx + 0.5)}%`, top: `${py(desk.ty - 1.7)}%`, width: "5%" }}
      >
        <FloatingLabel name={name} color={color} blinking={isActive} />
        {npc && (
          <div className={`relative w-[80%] aspect-[12/14] mt-0.5 ${isActive ? "anim-walk" : ""}`}>
            <div className="sprite-shadow" />
            <PixelPerson {...npc} />
          </div>
        )}
      </div>
      <Deco tx={desk.tx} ty={desk.ty} tw={2.4} th={1.6} z={15}>
        <Desk active={isActive} />
      </Deco>
      {/* banquito frente al escritorio */}
      <Deco tx={desk.tx + 0.9} ty={desk.ty + 1.62} tw={0.62} th={0.62} z={6}>
        <Stool />
      </Deco>
    </>
  );
}

/* ===== Mapa principal ===== */

export default function RetroOfficeMap({ status }: { status: AgentStatus }) {
  const jarvis = jarvisPosition(status);

  return (
    <div className="crt-frame w-full" style={{ aspectRatio: `${GRID_W}/${GRID_H}` }}>
      {/* piso ajedrezado de la sala principal */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#b8c9ae",
          backgroundImage:
            "repeating-conic-gradient(#bccdb2 0% 25%, #b2c4a7 0% 50%)",
          backgroundSize: `${200 / GRID_W}% ${200 / GRID_H}%`,
        }}
      />

      {/* sala superior derecha con piso de madera */}
      <div
        className="absolute"
        style={{
          left: `${px(11.7)}%`,
          top: `${py(0.7)}%`,
          width: `${px(GRID_W - 0.5 - 11.7)}%`,
          height: `${py(6.2 - 0.7)}%`,
          backgroundColor: "#d3b389",
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(120,80,40,0.25) 0 1px, transparent 1px 14px)," +
            "repeating-linear-gradient(to right, rgba(120,80,40,0.12) 0 1px, transparent 1px 42px)",
          zIndex: 1,
        }}
      />

      {/* alfombras */}
      <Deco tx={2.5} ty={6.35} tw={3.5} th={2.9} z={2}>
        <Rug color="#d9c9a4" border="#bfae87" />
      </Deco>
      <Deco tx={12.5} ty={10.0} tw={2.2} th={1.2} z={2}>
        <Rug color="#b57272" border="#95575c" />
      </Deco>

      {/* luz que entra por las ventanas */}
      <div
        className="light-shaft"
        style={{ left: `${px(5.7)}%`, top: `${py(0.7)}%`, width: `${px(1.8)}%`, height: `${py(3.6)}%`, zIndex: 3 }}
      />
      <div
        className="light-shaft"
        style={{ left: `${px(15.8)}%`, top: `${py(0.7)}%`, width: `${px(1.8)}%`, height: `${py(3.2)}%`, zIndex: 3 }}
      />

      {/* paredes: perímetro + divisiones internas (como la referencia) */}
      <Wall tx={0} ty={0} tw={GRID_W} th={0.7} />
      <Wall tx={0} ty={GRID_H - 0.5} tw={GRID_W} th={0.5} />
      <Wall tx={0} ty={0} tw={0.5} th={GRID_H} />
      <Wall tx={GRID_W - 0.5} ty={0} tw={0.5} th={GRID_H} />
      {/* división vertical de las salas de la derecha, con hueco de puerta */}
      <Wall tx={11.2} ty={0} tw={0.5} th={2.2} />
      <Wall tx={11.2} ty={4.2} tw={0.5} th={4.4} />
      <Wall tx={11.2} ty={10.6} tw={0.5} th={2.4} />
      {/* división horizontal entre sala OpenClaw y sala Browser */}
      <Wall tx={11.2} ty={6.2} tw={4.2} th={0.5} />
      <Wall tx={16.6} ty={6.2} tw={1.4} th={0.5} />

      {/* decoración pared superior */}
      <Deco tx={0.7} ty={0.15} tw={1.6} th={1.4} z={12}>
        <CoffeeMachine />
      </Deco>
      <Deco tx={2.7} ty={0.02} tw={1.9} th={0.85} z={12}>
        <Whiteboard />
      </Deco>
      <Deco tx={4.85} ty={0.05} tw={0.85} th={0.72} z={12}>
        <WallClock />
      </Deco>
      <Deco tx={5.9} ty={0.02} tw={1.6} th={0.75} z={12}>
        <OfficeWindow />
      </Deco>
      <Deco tx={15.9} ty={0.02} tw={1.6} th={0.75} z={12}>
        <OfficeWindow />
      </Deco>
      <Deco tx={9.7} ty={0.3} tw={0.8} th={1.5} z={12}>
        <WaterCooler />
      </Deco>

      {/* mobiliario */}
      <Deco tx={0.6} ty={4.6} tw={1.5} th={1.55} z={6}>
        <Bookshelf />
      </Deco>
      <Deco tx={0.62} ty={1.15} tw={0.75} th={1.25} z={6}>
        <FileCabinet />
      </Deco>
      <Deco tx={1.1} ty={11.1} tw={2.3} th={1.15} z={6}>
        <Sofa />
      </Deco>
      <Deco tx={3.8} ty={11.4} tw={1.25} th={0.8} z={6}>
        <LowTable />
      </Deco>
      <Deco tx={0.62} ty={9.4} tw={0.9} th={1.4} z={6}>
        <Plant />
      </Deco>
      <Deco tx={16.6} ty={4.6} tw={0.9} th={1.4} z={6}>
        <Plant />
      </Deco>
      <Deco tx={16.6} ty={7.2} tw={0.9} th={1.4} z={6}>
        <Plant />
      </Deco>
      <Deco tx={10.3} ty={11.2} tw={0.9} th={1.4} z={6}>
        <Plant />
      </Deco>
      <Deco tx={12.0} ty={6.9} tw={0.9} th={0.75} z={12}>
        <WallClock />
      </Deco>
      <Deco tx={13.2} ty={12.1} tw={1.4} th={0.8} z={6}>
        <DoorMat />
      </Deco>

      {/* escritorio personal de Jarvis */}
      <Deco tx={JARVIS_DESK.tx} ty={JARVIS_DESK.ty} tw={2.4} th={1.6} z={15}>
        <Desk active={status.state !== "disconnected"} />
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

      {/* viñeta + LED de encendido */}
      <div className="map-vignette" />
      <div className="crt-led" />
    </div>
  );
}
