import type { AgentSnapshot, AgentStatus, CommandLog } from "@/types/agent";
import { mockAgent } from "./mockAgent";

/**
 * Capa de integración con OpenClaw.
 *
 * HOY: delega en `mockAgent` para que la interfaz sea 100% funcional
 * sin backend.
 *
 * MAÑANA: sustituye el cuerpo de cada función por llamadas reales al
 * gateway de OpenClaw. Los puntos de conexión están marcados con
 * `TODO(openclaw)`. La UI no necesita ningún cambio: solo consume
 * esta interfaz.
 */

export async function connectWithGatewayToken(token: string): Promise<boolean> {
  // TODO(openclaw): POST {GATEWAY_URL}/auth con { token } y validar la respuesta.
  // return fetch(`${process.env.NEXT_PUBLIC_OPENCLAW_URL}/auth`, {...}).then(r => r.ok)
  return mockAgent.connectWithGatewayToken(token);
}

export async function getAgentStatus(): Promise<AgentStatus> {
  // TODO(openclaw): GET {GATEWAY_URL}/status
  return mockAgent.snapshot().status;
}

export async function sendCommand(command: string): Promise<CommandLog> {
  // TODO(openclaw): POST {GATEWAY_URL}/command con { command }
  return mockAgent.sendCommand(command);
}

/**
 * Streaming de estado + logs.
 * TODO(openclaw): reemplazar la suscripción al mock por un WebSocket o SSE:
 *   const ws = new WebSocket(`${GATEWAY_WS_URL}/stream`);
 *   ws.onmessage = (e) => callback(JSON.parse(e.data));
 *   return () => ws.close();
 * Devuelve una función de limpieza para desuscribirse.
 */
export function streamAgent(callback: (snap: AgentSnapshot) => void): () => void {
  return mockAgent.subscribe(callback);
}

/** Compatibilidad con la firma pedida: solo logs. */
export function streamLogs(callback: (log: CommandLog) => void): () => void {
  let seen = new Set<string>();
  return mockAgent.subscribe((snap) => {
    for (const log of snap.logs) {
      if (!seen.has(log.id)) {
        seen.add(log.id);
        callback(log);
      }
    }
  });
}

export function clearConsole(): void {
  mockAgent.clearLogs();
}
