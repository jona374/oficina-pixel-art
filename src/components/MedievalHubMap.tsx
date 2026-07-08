"use client";

import type { AgentStatus } from "@/types/agent";
import FloatingLabel from "./FloatingLabel";
import CharacterInfoPanel from "./characters/CharacterInfoPanel";
import { AGENT_PROFILES } from "@/characters/agentProfiles";
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
  MARINA_CONFIG,
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
  marina: MARINA_CONFIG,
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
  selected,
  onSelect,
}: {
  def: HabitantDef;
  life?: WandererState;
  overridePos?: { x: number; y: number };
  overrideWalking?: boolean;
  agentThinking: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const pos = overridePos ?? (life ? { x: life.pos.tx, y: life.pos.ty } : def.home);
  const walking = overrideWalking ?? !!life?.walking;
  const facing = useFacing(pos.x);
  const width = habitantWidthPct(def.vw, def.vh);
  return (
    <div
      className={`hab-wrapper absolute character-move ${selected ? "is-selected" : ""}`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: `${width}%`,
        transform: "translate(-50%, -100%)",
        transformOrigin: "bottom center",
        // profundidad isométrica: quien está más abajo (mayor y) tapa
        // a quien está más arriba (más atrás en la sala).
        zIndex: 20 + Math.round(pos.y) + (selected ? 100 : 0),
      }}
    >
      <div className="character-label absolute left-1/2 -translate-x-1/2 bottom-full mb-0.5 whitespace-nowrap">
        <FloatingLabel name={def.label} color={def.color} blinking={walking} />
      </div>
      <div
        className="hab-hit relative"
        role="button"
        tabIndex={0}
        aria-label={`Ver ficha de ${def.label}`}
        onClick={() => onSelect(def.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(def.id);
          }
        }}
      >
        {selected && <div className="selection-ring" />}
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

const STATE_LABEL: Record<string, { text: string; color: string }> = {
  idle: { text: "En reposo", color: "#62ff8e" },
  thinking: { text: "Pensando", color: "#f6c85f" },
  running: { text: "Ejecutando", color: "#60a5e0" },
  done: { text: "Listo", color: "#62ff8e" },
  error: { text: "Error", color: "#ff5c7a" },
  disconnected: { text: "Desconectado", color: "#70708a" },
};

/** Mapa principal: Medieval Fantasy Hub. Selección controlada desde
 *  la página (para que el menú "Agentes" también abra fichas). */
export default function MedievalHubMap({
  status,
  selectedId,
  onSelect,
}: {
  status: AgentStatus;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const connected = status.state !== "disconnected";
  const setSelectedId = onSelect;

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
        const isJarvis = h.kind === "jarvis";
        return (
          <Habitant
            key={h.id}
            def={h}
            life={life[h.id]}
            overridePos={isJarvis && running ? JARVIS_ACTION_SPOT : undefined}
            overrideWalking={isJarvis && running ? true : undefined}
            agentThinking={thinking}
            selected={selectedId === h.id}
            onSelect={setSelectedId}
          />
        );
      })}

      {/* viñeta suave del marco */}
      <div className="map-vignette" />

      {/* panel de ficha del personaje seleccionado */}
      {selectedId && AGENT_PROFILES[selectedId] && (() => {
        const def = HABITANTS.find((h) => h.id === selectedId)!;
        // Jarvis refleja el estado real del agente; los demás, su
        // actividad actual (caminando / en reposo).
        const live = life[selectedId];
        let text: string, color: string;
        if (def.kind === "jarvis") {
          const s = STATE_LABEL[status.state] ?? STATE_LABEL.idle;
          text = s.text;
          color = s.color;
        } else if (live?.walking) {
          text = "En movimiento";
          color = "#60a5e0";
        } else {
          text = "En reposo";
          color = "#62ff8e";
        }
        return (
          <CharacterInfoPanel
            profile={AGENT_PROFILES[selectedId]}
            liveStatus={text}
            statusColor={color}
            sprite={
              <div
                className="w-full"
                style={{ aspectRatio: `${def.vw}/${def.vh}` }}
              >
                <HabitantSprite
                  def={def}
                  walking={false}
                  facing="right"
                  agentThinking={false}
                  away={false}
                />
              </div>
            }
            onClose={() => setSelectedId(null)}
          />
        );
      })()}
    </div>
  );
}
