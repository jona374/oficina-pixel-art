import type {
  AgentSnapshot,
  AgentState,
  AgentStatus,
  CommandLog,
  ModuleId,
  TaskInfo,
} from "@/types/agent";
import { parseCommand } from "./commandParser";

type Listener = (snapshot: AgentSnapshot) => void;

const HELP_TEXT = [
  "Comandos disponibles:",
  "  status              — resumen del sistema",
  "  run task <texto>    — ejecutar una tarea simulada",
  "  stop                — detener la tarea actual",
  "  clear               — limpiar la consola",
  "  memory              — consultar memoria del agente",
  "  logs                — eventos recientes",
  "  tokens              — uso de tokens",
  "  context             — ventana de contexto",
  "  connect             — reconectar con el gateway",
  "  help                — esta ayuda",
].join("\n");

let logCounter = 0;
function makeLog(
  command: string,
  response: string,
  type: CommandLog["type"] = "info"
): CommandLog {
  return {
    id: `log-${Date.now()}-${logCounter++}`,
    command,
    response,
    timestamp: new Date().toISOString(),
    type,
  };
}

/**
 * Agente simulado. Reproduce el comportamiento esperado de OpenClaw
 * (estados, tareas con progreso, logs en streaming) sin backend real.
 * La capa `openclawClient.ts` delega aquí hasta que exista el gateway.
 */
class MockAgent {
  private listeners = new Set<Listener>();
  private timers: ReturnType<typeof setTimeout>[] = [];
  private taskStartedAt = 0;

  private status: AgentStatus = {
    connected: false,
    state: "disconnected",
    model: "claude-sonnet-5",
    gatewayTokenValid: false,
    activeModule: "jarvis",
    tokenUsage: { used: 1240, limit: 200000 },
    context: { used: 3200, limit: 200000 },
    taskElapsedMs: 0,
  };

  private task: TaskInfo | null = null;
  private logs: CommandLog[] = [];

  // ---------- suscripción ----------

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  snapshot(): AgentSnapshot {
    return {
      status: {
        ...this.status,
        taskElapsedMs: this.taskStartedAt
          ? Date.now() - this.taskStartedAt
          : 0,
      },
      task: this.task ? { ...this.task, subtasks: [...this.task.subtasks] } : null,
      logs: [...this.logs],
    };
  }

  private emit() {
    const snap = this.snapshot();
    this.listeners.forEach((l) => l(snap));
  }

  private pushLog(log: CommandLog) {
    this.logs = [...this.logs.slice(-99), log];
    this.emit();
  }

  private setState(state: AgentState, activeModule?: ModuleId) {
    this.status = {
      ...this.status,
      state,
      ...(activeModule ? { activeModule } : {}),
    };
    this.emit();
  }

  private schedule(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    this.timers.push(t);
    return t;
  }

  private clearTimers() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  private spendTokens(n: number) {
    this.status = {
      ...this.status,
      tokenUsage: {
        ...this.status.tokenUsage,
        used: Math.min(
          this.status.tokenUsage.used + n,
          this.status.tokenUsage.limit
        ),
      },
      context: {
        ...this.status.context,
        used: Math.min(
          this.status.context.used + Math.round(n * 0.6),
          this.status.context.limit
        ),
      },
    };
  }

  // ---------- API pública (misma forma que tendrá openclawClient) ----------

  async connectWithGatewayToken(token: string): Promise<boolean> {
    // Simula latencia de red del gateway.
    await new Promise((r) => setTimeout(r, 900));
    const valid = token.trim().length >= 4;
    this.status = {
      ...this.status,
      connected: valid,
      gatewayTokenValid: valid,
      state: valid ? "idle" : "disconnected",
    };
    if (valid) {
      this.pushLog(
        makeLog(
          "connect",
          "Gateway token aceptado. Jarvis conectado y en espera.",
          "system"
        )
      );
    }
    this.emit();
    return valid;
  }

  clearLogs() {
    this.logs = [];
    this.emit();
  }

  async sendCommand(raw: string): Promise<CommandLog> {
    const { name, args } = parseCommand(raw);
    this.status = { ...this.status, lastCommand: raw };
    this.spendTokens(80 + raw.length * 3);

    // Jarvis "piensa" antes de responder cualquier comando.
    if (this.status.state === "idle" || this.status.state === "done") {
      this.setState("thinking");
    }
    await new Promise((r) => setTimeout(r, 650));

    let log: CommandLog;

    switch (name) {
      case "help":
        log = makeLog(raw, HELP_TEXT, "info");
        this.backToIdle();
        break;

      case "status": {
        const s = this.status;
        log = makeLog(
          raw,
          [
            `Conexión:        ${s.connected ? "connected ✓" : "disconnected ✗"}`,
            `Estado:          ${s.state === "thinking" ? "idle" : s.state}`,
            `Tarea actual:    ${this.task ? this.task.title : "ninguna"}`,
            `Tokens:          ${s.tokenUsage.used.toLocaleString()} / ${s.tokenUsage.limit.toLocaleString()}`,
            `Contexto:        ${s.context.used.toLocaleString()} / ${s.context.limit.toLocaleString()}`,
            `Modelo:          ${s.model}`,
            `Último comando:  ${s.lastCommand ?? "—"}`,
            `Herramientas:    browser, memory, tools, status`,
          ].join("\n"),
          "success"
        );
        this.setState(this.task ? "running" : "idle", "status");
        this.schedule(() => this.backToIdle(), 1800);
        break;
      }

      case "tokens": {
        const { used, limit } = this.status.tokenUsage;
        const pct = ((used / limit) * 100).toFixed(1);
        log = makeLog(
          raw,
          `Tokens usados: ${used.toLocaleString()} / ${limit.toLocaleString()} (${pct}%)`,
          "info"
        );
        this.backToIdle();
        break;
      }

      case "context": {
        const { used, limit } = this.status.context;
        const pct = ((used / limit) * 100).toFixed(1);
        log = makeLog(
          raw,
          `Ventana de contexto: ${used.toLocaleString()} / ${limit.toLocaleString()} tokens (${pct}%)`,
          "info"
        );
        this.backToIdle();
        break;
      }

      case "memory":
        log = makeLog(
          raw,
          [
            "Memoria del agente (mock):",
            "  • Usuario prefiere respuestas en español.",
            "  • Proyecto activo: interfaz retro OpenClaw.",
            "  • Última sesión: hace 2 horas.",
          ].join("\n"),
          "info"
        );
        this.setState("running", "memory");
        this.schedule(() => this.backToIdle(), 2200);
        break;

      case "logs": {
        const recent = this.logs.slice(-5);
        log = makeLog(
          raw,
          recent.length
            ? recent
                .map(
                  (l) =>
                    `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.command} → ${l.response.split("\n")[0]}`
                )
                .join("\n")
            : "No hay eventos registrados todavía.",
          "info"
        );
        this.backToIdle();
        break;
      }

      case "connect":
        this.status = {
          ...this.status,
          connected: true,
          gatewayTokenValid: true,
        };
        log = makeLog(raw, "Reconectado al gateway de OpenClaw.", "system");
        this.setState("running", "openclaw");
        this.schedule(() => this.backToIdle(), 2000);
        break;

      case "stop":
        if (this.task && !this.task.result && !this.task.error) {
          this.clearTimers();
          this.taskStartedAt = 0;
          this.task = { ...this.task, error: "Detenida por el usuario." };
          this.status = { ...this.status, currentTask: undefined };
          log = makeLog(raw, `Tarea detenida: ${this.task.title}`, "error");
          this.setState("idle", "jarvis");
        } else {
          log = makeLog(raw, "No hay ninguna tarea en ejecución.", "info");
          this.backToIdle();
        }
        break;

      case "run task":
        if (!args) {
          log = makeLog(raw, "Uso: run task <descripción de la tarea>", "error");
          this.backToIdle();
        } else {
          log = makeLog(
            raw,
            `Jarvis está ejecutando la tarea: ${args}\nEstado: running\nProgreso: 0% → 100%`,
            "system"
          );
          this.startTask(args);
        }
        break;

      default:
        log = makeLog(
          raw,
          `Comando desconocido: "${raw}". Escribe "help" para ver los comandos.`,
          "error"
        );
        this.backToIdle();
    }

    this.status = { ...this.status, lastResponse: log.response.split("\n")[0] };
    this.pushLog(log);
    return log;
  }

  private backToIdle() {
    if (this.task && !this.task.result && !this.task.error) return; // hay tarea corriendo
    this.setState("idle", "jarvis");
  }

  // ---------- simulación de tareas ----------

  private startTask(title: string) {
    this.clearTimers();
    const subtasks = [
      { label: "Analizar la instrucción", done: false },
      { label: "Planificar pasos", done: false },
      { label: "Ejecutar con herramientas", done: false },
      { label: "Verificar resultado", done: false },
    ];
    this.task = {
      id: `task-${Date.now()}`,
      title,
      subtasks,
      progress: 0,
    };
    this.taskStartedAt = Date.now();
    this.status = { ...this.status, currentTask: title };

    // Jarvis camina hacia el módulo más relacionado con la tarea.
    const module = this.guessModule(title);
    this.setState("running", module);

    const STEP_MS = 700;
    for (let step = 1; step <= 10; step++) {
      this.schedule(() => {
        if (!this.task || this.task.error) return;
        const progress = step * 10;
        const doneCount = Math.min(
          subtasks.length,
          Math.floor((progress / 100) * subtasks.length)
        );
        this.task = {
          ...this.task,
          progress,
          subtasks: subtasks.map((s, i) => ({ ...s, done: i < doneCount })),
        };
        this.spendTokens(120);

        if (progress === 30 || progress === 70) {
          this.pushLog(
            makeLog(
              "",
              `[Jarvis] progreso ${progress}% — ${subtasks[doneCount - 1]?.label ?? "trabajando"}...`,
              "system"
            )
          );
        }

        if (progress >= 100) {
          this.task = {
            ...this.task,
            progress: 100,
            subtasks: subtasks.map((s) => ({ ...s, done: true })),
            result: "Tarea completada correctamente.",
          };
          this.taskStartedAt = 0;
          this.status = { ...this.status, currentTask: undefined };
          this.setState("done", "jarvis");
          this.pushLog(
            makeLog(
              "",
              `Resultado: tarea completada correctamente — "${title}"`,
              "success"
            )
          );
          this.schedule(() => this.setState("idle", "jarvis"), 2500);
        } else {
          this.emit();
        }
      }, step * STEP_MS);
    }
  }

  private guessModule(title: string): ModuleId {
    const t = title.toLowerCase();
    if (/(web|http|url|navega|buscar|browser)/.test(t)) return "browser";
    if (/(memoria|recuerda|memory|historial)/.test(t)) return "memory";
    if (/(conexi|gateway|openclaw|api)/.test(t)) return "openclaw";
    if (/(estado|status|monitor)/.test(t)) return "status";
    return "tools";
  }
}

/** Singleton compartido por toda la UI. */
export const mockAgent = new MockAgent();
