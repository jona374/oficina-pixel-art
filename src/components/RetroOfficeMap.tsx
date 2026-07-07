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
      <rect x="8" y="1" width="6" height="4" fill={active ? "#7ee787" : "#5a7a9a"} />
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

function Plant() {
  return (
    <svg viewBox="0 0 10 14" className="w-full h-full pixelated" aria-hidden>
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
    <svg viewBox="0 0 12 10" className="w-full h-full pixelated" aria-hidden>
      <rect x="0" y="8" width="12" height="2" fill="#8a6236" />
      <rect x="1" y="0" width="6" height="8" fill="#4a4a5a" />
      <rect x="2" y="1" width="4" height="2" fill="#e06060" />
      <rect x="3" y="5" width="2" height="2" fill="#e8e0d0" />
      <rect x="8" y="4" width="3" height="4" fill="#e8e0d0" />
    </svg>
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

/* ===== Piezas del mapa ===== */

function Wall({ tx, ty, tw, th }: { tx: number; ty: number; tw: number; th: number }) {
  return (
    <div
      className="absolute bg-crt-beige border border-[#c8bca8] z-10"
      style={{
        left: `${px(tx)}%`,
        top: `${py(ty)}%`,
        width: `${px(tw)}%`,
        height: `${py(th)}%`,
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
          <div className={`w-[80%] aspect-[12/14] mt-0.5 ${isActive ? "anim-walk" : ""}`}>
            <PixelPerson {...npc} />
          </div>
        )}
      </div>
      <Deco tx={desk.tx} ty={desk.ty} tw={2.4} th={1.6} z={15}>
        <Desk active={isActive} />
      </Deco>
    </>
  );
}

/* ===== Mapa principal ===== */

export default function RetroOfficeMap({ status }: { status: AgentStatus }) {
  const jarvis = jarvisPosition(status);

  return (
    <div className="crt-frame w-full" style={{ aspectRatio: `${GRID_W}/${GRID_H}` }}>
      {/* piso con cuadrícula */}
      <div
        className="absolute inset-0 bg-crt-floor"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: `${100 / GRID_W}% ${100 / GRID_H}%`,
        }}
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

      {/* decoración */}
      <Deco tx={0.7} ty={0.15} tw={1.6} th={1.4}>
        <CoffeeMachine />
      </Deco>
      <Deco tx={3.6} ty={0.05} tw={0.9} th={0.75}>
        <WallClock />
      </Deco>
      <Deco tx={5.2} ty={0.02} tw={1.6} th={0.75}>
        <OfficeWindow />
      </Deco>
      <Deco tx={15.9} ty={0.02} tw={1.6} th={0.75}>
        <OfficeWindow />
      </Deco>
      <Deco tx={9.7} ty={0.3} tw={0.8} th={1.5}>
        <WaterCooler />
      </Deco>
      <Deco tx={16.6} ty={4.6} tw={0.9} th={1.4}>
        <Plant />
      </Deco>
      <Deco tx={16.6} ty={7.2} tw={0.9} th={1.4}>
        <Plant />
      </Deco>
      <Deco tx={12.0} ty={6.9} tw={0.9} th={0.75}>
        <WallClock />
      </Deco>
      <Deco tx={13.2} ty={12.1} tw={1.4} th={0.8}>
        <DoorMat />
      </Deco>
      <Deco tx={1.0} ty={10.8} tw={0.9} th={1.4}>
        <Plant />
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
    </div>
  );
}
