"use client";

import { useState } from "react";
import GatewayLogin from "@/components/GatewayLogin";
import RetroOfficeMap from "@/components/RetroOfficeMap";
import CommandConsole from "@/components/CommandConsole";
import StatusPanel from "@/components/StatusPanel";
import TaskPanel from "@/components/TaskPanel";
import { PixelPerson } from "@/components/JarvisCharacter";
import { useAgentStatus } from "@/hooks/useAgentStatus";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const { status, task, logs } = useAgentStatus();

  if (!authenticated) {
    return <GatewayLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <main className="min-h-screen p-3 lg:p-6">
      <div className="screen-scanlines" />

      <header className="max-w-7xl mx-auto flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-5 aspect-[12/14]">
            <PixelPerson hair="#e8e8e8" skin="#f0c8a0" shirt="#f5f0e8" pants="#8a7a5a" />
          </div>
          <h1 className="panel-title text-[11px] text-glow">
            JARVIS · OPENCLAW
          </h1>
          <span className="hidden sm:inline text-[8px] tracking-[0.2em] text-[var(--text-low)] uppercase">
            centro de operaciones
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hud-chip hidden md:inline">{status.model}</span>
          <span className="hud-chip">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 anim-blink align-middle"
              style={{ backgroundColor: status.connected ? "var(--green)" : "var(--red)" }}
            />
            {status.connected ? "LINK" : "OFFLINE"}
          </span>
          <span className="hud-chip hidden sm:inline">v0.1 · MOCK</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* columna izquierda: oficina + consola */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="w-full max-w-[780px] mx-auto">
            <RetroOfficeMap status={status} />
          </div>
          <div className="h-64 lg:h-72">
            <CommandConsole logs={logs} />
          </div>
        </div>

        {/* columna derecha: paneles */}
        <div className="flex flex-col gap-4">
          <StatusPanel status={status} />
          <TaskPanel task={task} />
        </div>
      </div>
    </main>
  );
}
