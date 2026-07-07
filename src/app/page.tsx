"use client";

import { useState } from "react";
import GatewayLogin from "@/components/GatewayLogin";
import RetroOfficeMap from "@/components/RetroOfficeMap";
import CommandConsole from "@/components/CommandConsole";
import StatusPanel from "@/components/StatusPanel";
import TaskPanel from "@/components/TaskPanel";
import { useAgentStatus } from "@/hooks/useAgentStatus";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const { status, task, logs } = useAgentStatus();

  if (!authenticated) {
    return <GatewayLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <main className="min-h-screen bg-crt-bg p-3 lg:p-5">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-3">
        <h1 className="text-[12px] text-crt-green tracking-widest">
          ▸ JARVIS · OPENCLAW — CENTRO DE OPERACIONES
        </h1>
        <span className="text-[9px] text-gray-600">v0.1 · modo mock</span>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">
        {/* columna izquierda: oficina + consola */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="w-full max-w-[780px] mx-auto">
            <RetroOfficeMap status={status} />
          </div>
          <div className="h-64 lg:h-72">
            <CommandConsole logs={logs} />
          </div>
        </div>

        {/* columna derecha: paneles */}
        <div className="flex flex-col gap-3">
          <StatusPanel status={status} />
          <TaskPanel task={task} />
        </div>
      </div>
    </main>
  );
}
