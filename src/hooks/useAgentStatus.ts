"use client";

import { useEffect, useState } from "react";
import type { AgentSnapshot } from "@/types/agent";
import { streamAgent } from "@/lib/openclawClient";

const EMPTY: AgentSnapshot = {
  status: {
    connected: false,
    state: "disconnected",
    model: "—",
    gatewayTokenValid: false,
    activeModule: "jarvis",
    tokenUsage: { used: 0, limit: 1 },
    context: { used: 0, limit: 1 },
    taskElapsedMs: 0,
  },
  task: null,
  logs: [],
};

/** Suscribe la UI al stream de estado del agente (mock o real). */
export function useAgentStatus(): AgentSnapshot {
  const [snapshot, setSnapshot] = useState<AgentSnapshot>(EMPTY);

  useEffect(() => {
    const unsubscribe = streamAgent(setSnapshot);
    return unsubscribe;
  }, []);

  // Tick para el cronómetro de tarea mientras corre.
  const running = snapshot.status.state === "running";
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  return snapshot;
}
