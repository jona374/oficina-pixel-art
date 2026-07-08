"use client";

import type { AgentStatus } from "@/types/agent";
import FloatingLabel from "./FloatingLabel";
import { JarvisSprite } from "./JarvisCharacter";
import { JARVIS_ANIMATIONS } from "@/lib/characterAnimations";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import NunCharacter from "./NunCharacter";
import CastSprite from "./CastSprites";
import FreeKnightCharacter, { useFacing } from "@/characters/freeKnight/FreeKnightCharacter";
import SheetCharacter from "@/characters/sheetCharacter/SheetCharacter";
import {
  SAMURAI_CONFIG,
  MINOTAUR_CONFIG,
  WIZARD_CONFIG,
} from "@/characters/sheetCharacter/configs";
import type { SheetCharacterConfig } from "@/characters/sheetCharacter/types";
import { useOfficeLife, type WandererConfig, type WandererState } from "@/hooks/useOfficeLife";
import {
  MEDIEVAL_HUB,
  HABITANTS,
  JARVIS_ACTION_SPOT,
  habitantWidthPct,
  type HabitantDef,
} from "@/environments/medievalHub/config";

const SHEET_CONFIGS: Record<string, SheetCharacterConfig> = {
  samurai: SAMURAI_CONFIG,
  minotaur: MINOTAUR_CONFIG,
  wizard: WIZARD_CONFIG,
};

/** Cuerpo de Jarvis animado por frames (idle/walk). */
function JarvisBody({ walking }: { walking: boolean }) {
  const { frame } = useCharacterAnimation(JARVIS_ANIMATIONS, walking ? "walk" : "idle");
  return <JarvisSprite moving={walking} frame={frame} />;
}

/** Sprite del habitante según su tipo. */
function HabitantSprite({
  def,
  walking,
  facing,
  agentThinking,
  away,
}: {
  def: HabitantDef;
  walking: boolean;
  facing: "left" | "right";
  agentThinking: boolean;
  away: boolean;
}) {
  switch (def.kind) {
    case "jarvis":
      return <JarvisBody walking={walking} />;
    case "oracle":
      return <NunCharacter walking={walking} away={away} agentThinking={agentThinking} />;
    case "knight":
      return <FreeKnightCharacter walking={walking} facing={facing} />;
    case "sheet":
      return (
        <SheetCharacter
          config={SHEET_CONFIGS[def.sheetKey!]}
          walking={walking}
          facing={facing}
        />
      );
    case "cast":
      return (
        <div className={`w-full ${walking ? "anim-walk" : def.idleClass ?? ""}`}>
          <CastSprite id={def.castId as never} />
        </div>
      );
  }
}

/** Un habitante posicionado sobre el fondo, con los pies anclados. */
function Habitant({
  def,
  life,
  overridePos,
  overrideWalking,
  agentThinking,
}: {
  def: HabitantDef;
  life?: WandererState;
  overridePos?: { x: number; y: number };
  overrideWalking?: boolean;
  agentThinking: boolean;
}) {
  const pos = overridePos ?? (life ? { x: life.pos.tx, y: life.pos.ty } : def.home);
  const walking = overrideWalking ?? !!life?.walking;
  const facing = useFacing(pos.x);
  const width = habitantWidthPct(def.vw, def.vh);
  return (
    <div
      className="absolute z-20 character-move"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: `${width}%`,
        transform: "translate(-50%, -100%)",
        transformOrigin: "bottom center",
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-0.5 whitespace-nowrap">
        <FloatingLabel name={def.label} color={def.color} blinking={walking} />
      </div>
      <div className="relative">
        <div className="sprite-shadow" style={{ left: "22%", width: "56%", bottom: "0px" }} />
        <HabitantSprite
          def={def}
          walking={walking}
          facing={facing}
          agentThinking={agentThinking}
          away={!!life?.away}
        />
      </div>
    </div>
  );
}

/** Mapa principal: Medieval Fantasy Hub. */
export default function MedievalHubMap({ status }: { status: AgentStatus }) {
  const connected = status.state !== "disconnected";

  // Vida de la oficina para todos los habitantes (posiciones en %).
  const lifeConfigs: WandererConfig[] = HABITANTS.map((h) => ({
    id: h.id,
    home: { tx: h.home.x, ty: h.home.y },
    pois: h.pois.map((p) => ({ tx: p.x, ty: p.y })),
    minRest: h.minRest,
    maxRest: h.maxRest,
  }));
  const life = useOfficeLife(lifeConfigs, connected);

  // Jarvis: cuando ejecuta una tarea va al punto de acción.
  const running = status.state === "running";
  const thinking = status.state === "thinking";

  return (
    <div
      className="crt-frame w-full"
      style={{
        aspectRatio: `${MEDIEVAL_HUB.width}/${MEDIEVAL_HUB.height}`,
        backgroundColor: "#100c0a",
      }}
    >
      {/* fondo del entorno */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MEDIEVAL_HUB.image}
        alt="Medieval Fantasy Hub"
        className="absolute inset-0 w-full h-full pixelated select-none"
        style={{ imageRendering: "pixelated" }}
        draggable={false}
      />

      {/* habitantes */}
      {HABITANTS.map((h) => {
        if (h.kind === "jarvis") {
          return (
            <Habitant
              key={h.id}
              def={h}
              life={life[h.id]}
              overridePos={running ? JARVIS_ACTION_SPOT : undefined}
              overrideWalking={running ? true : undefined}
              agentThinking={thinking}
            />
          );
        }
        return <Habitant key={h.id} def={h} life={life[h.id]} agentThinking={thinking} />;
      })}

      {/* viñeta suave del marco */}
      <div className="map-vignette" />
    </div>
  );
}
