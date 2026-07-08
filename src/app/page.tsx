"use client";

import { useState } from "react";
import GatewayLogin from "@/components/GatewayLogin";
import MedievalHubMap from "@/components/MedievalHubMap";
import CommandConsole from "@/components/CommandConsole";
import StatusPanel from "@/components/StatusPanel";
import TaskPanel from "@/components/TaskPanel";
import FloatingPanel from "@/components/immersive/FloatingPanel";
import ImmersiveMenu, { type PanelKey } from "@/components/immersive/ImmersiveMenu";
import AgentRoster from "@/components/immersive/AgentRoster";
import { useAgentStatus } from "@/hooks/useAgentStatus";

const HUB_ASPECT = 1448 / 1086;

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const { status, task, logs } = useAgentStatus();

  // Modo inmersivo (por defecto): solo la taberna + personajes + menú.
  const [immersive, setImmersive] = useState(true);
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [fichaOpen, setFichaOpen] = useState(false);

  if (!authenticated) {
    return <GatewayLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  const map = (
    <MedievalHubMap
      status={status}
      selectedId={selectedCharacter}
      onSelect={(id) => {
        setSelectedCharacter(id);
        if (!id) setFichaOpen(false);
      }}
      fichaOpen={fichaOpen}
      onOpenFicha={() => setFichaOpen(true)}
      onCloseFicha={() => setFichaOpen(false)}
    />
  );

  // ---------- Vista clásica (alterna, para debug/administración) ----------
  if (!immersive) {
    return (
      <main className="min-h-screen p-3 lg:p-6">
        <header className="max-w-7xl mx-auto flex items-center justify-between mb-4">
          <h1 className="panel-title text-[11px] text-glow">JARVIS · OPENCLAW</h1>
          <button
            onClick={() => setImmersive(true)}
            className="rpg-btn text-[9px] px-3 py-1.5 rounded font-pixel tracking-widest"
          >
            MODO INMERSIVO
          </button>
        </header>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="flex flex-col gap-4 min-w-0">
            <div className="w-full max-w-[720px] mx-auto">{map}</div>
            <div className="h-64 lg:h-72">
              <CommandConsole logs={logs} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <StatusPanel status={status} />
            <TaskPanel task={task} />
          </div>
        </div>
      </main>
    );
  }

  // ---------- Vista inmersiva (por defecto) ----------
  return (
    <main className="fixed inset-0 bg-[var(--bg-void)] overflow-hidden">
      {/* la taberna llena la pantalla (letterbox), como una escena de juego */}
      <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-3">
        <div
          className="max-w-full max-h-full"
          style={{ width: `min(100%, calc((100vh - 1.5rem) * ${HUB_ASPECT}))`, aspectRatio: `${HUB_ASPECT}` }}
        >
          {map}
        </div>
      </div>

      {/* marca discreta */}
      <div className="brand-overlay flex items-center gap-2 pointer-events-none">
        <span className="panel-title text-[9px] text-glow">JARVIS · OPENCLAW</span>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full anim-blink"
          style={{ backgroundColor: status.connected ? "var(--green)" : "var(--red)" }}
        />
      </div>

      {/* menú compacto */}
      <ImmersiveMenu
        onPick={(k) => setActivePanel(k)}
        onCloseAll={() => {
          setActivePanel(null);
          setSelectedCharacter(null);
        }}
      />

      {/* paneles flotantes bajo demanda */}
      {activePanel === "console" && (
        <FloatingPanel title="Consola" onClose={() => setActivePanel(null)} bodyClassName="h-[60vh] md:h-[62vh]">
          <div className="h-full">
            <CommandConsole logs={logs} />
          </div>
        </FloatingPanel>
      )}
      {activePanel === "status" && (
        <FloatingPanel title="Estado" onClose={() => setActivePanel(null)} bodyClassName="p-3">
          <StatusPanel status={status} />
        </FloatingPanel>
      )}
      {activePanel === "tasks" && (
        <FloatingPanel title="Tareas" onClose={() => setActivePanel(null)} bodyClassName="p-3">
          <TaskPanel task={task} />
        </FloatingPanel>
      )}
      {activePanel === "agents" && (
        <FloatingPanel title="Agentes" onClose={() => setActivePanel(null)}>
          <AgentRoster
            onPick={(id) => {
              setSelectedCharacter(id);
              setFichaOpen(true);
              setActivePanel(null);
            }}
          />
        </FloatingPanel>
      )}
      {activePanel === "settings" && (
        <FloatingPanel title="Ajustes" onClose={() => setActivePanel(null)} bodyClassName="p-4">
          <div className="space-y-4 font-term text-[15px] text-[#c9b892]">
            <label className="flex items-center justify-between gap-3">
              <span>Modo inmersivo</span>
              <button
                onClick={() => setImmersive(false)}
                className="rpg-btn px-3 py-1 rounded font-pixel text-[9px] text-[#7ee787]"
              >
                VISTA CLÁSICA
              </button>
            </label>
            <p className="text-[13px] text-[#9a8b6a] leading-snug">
              La vista clásica muestra la consola y los paneles fijos, útil para
              administración. En móvil la vista inmersiva es la principal.
            </p>
            <div className="rpg-divider" />
            <div className="flex justify-between">
              <span className="text-[#8a7a5a]">Modelo</span>
              <span className="text-[#e8d6a8]">{status.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a7a5a]">Conexión</span>
              <span style={{ color: status.connected ? "#7ee787" : "#ff5c7a" }}>
                {status.connected ? "conectado" : "desconectado"}
              </span>
            </div>
          </div>
        </FloatingPanel>
      )}
    </main>
  );
}
