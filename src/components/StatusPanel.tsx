import type { AgentStatus } from "@/types/agent";

const STATE_STYLE: Record<AgentStatus["state"], { color: string; label: string }> = {
  idle: { color: "#7ee787", label: "IDLE" },
  thinking: { color: "#e0b060", label: "THINKING" },
  running: { color: "#60a5e0", label: "RUNNING" },
  error: { color: "#e06060", label: "ERROR" },
  done: { color: "#7ee787", label: "DONE" },
  disconnected: { color: "#777777", label: "OFFLINE" },
};

function Meter({ used, limit, color }: { used: number; limit: number; color: string }) {
  const pct = Math.min(100, (used / limit) * 100);
  return (
    <div className="h-2 bg-black/50 border border-crt-border">
      <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline gap-2 text-[10px]">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-200 text-right truncate">{children}</span>
    </div>
  );
}

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function StatusPanel({ status }: { status: AgentStatus }) {
  const state = STATE_STYLE[status.state];
  return (
    <section className="retro-panel retro-corners p-4 space-y-2.5">
      <header className="flex items-center justify-between border-b border-[var(--border-dim)] pb-2 mb-1">
        <h2 className="panel-title">▸ ESTADO</h2>
        <span
          className="text-[9px] px-2 py-0.5 border anim-blink"
          style={{ color: state.color, borderColor: state.color }}
        >
          ● {state.label}
        </span>
      </header>

      <Row label="Conexión">
        <span className={status.connected ? "text-crt-green" : "text-crt-red"}>
          {status.connected ? "connected" : "disconnected"}
        </span>
      </Row>
      <Row label="Gateway token">
        <span className={status.gatewayTokenValid ? "text-crt-green" : "text-crt-red"}>
          {status.gatewayTokenValid ? "válido ✓" : "inválido ✗"}
        </span>
      </Row>
      <Row label="Modelo">{status.model}</Row>
      <Row label="Tarea">{status.currentTask ?? "—"}</Row>
      <Row label="Tiempo tarea">
        {status.taskElapsedMs > 0 ? formatElapsed(status.taskElapsedMs) : "—"}
      </Row>
      <Row label="Último cmd">{status.lastCommand ?? "—"}</Row>

      <div className="space-y-1 pt-1">
        <Row label="Tokens">
          {status.tokenUsage.used.toLocaleString()} /{" "}
          {status.tokenUsage.limit.toLocaleString()}
        </Row>
        <Meter used={status.tokenUsage.used} limit={status.tokenUsage.limit} color="#7ee787" />
      </div>
      <div className="space-y-1">
        <Row label="Contexto">
          {status.context.used.toLocaleString()} / {status.context.limit.toLocaleString()}
        </Row>
        <Meter used={status.context.used} limit={status.context.limit} color="#b088e0" />
      </div>

      {status.lastResponse && (
        <p className="text-[9px] text-gray-500 border-t border-crt-border pt-2 truncate">
          ↳ {status.lastResponse}
        </p>
      )}
    </section>
  );
}
