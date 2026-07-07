export type AgentState =
  | "idle"
  | "thinking"
  | "running"
  | "error"
  | "done"
  | "disconnected";

/** Módulos de la oficina: cada uno tiene un escritorio en el mapa. */
export type ModuleId =
  | "jarvis"
  | "openclaw"
  | "memory"
  | "tools"
  | "browser"
  | "status";

export type AgentStatus = {
  connected: boolean;
  state: AgentState;
  model: string;
  gatewayTokenValid: boolean;
  currentTask?: string;
  /** Módulo hacia el que Jarvis camina / en el que trabaja. */
  activeModule: ModuleId;
  tokenUsage: {
    used: number;
    limit: number;
  };
  context: {
    used: number;
    limit: number;
  };
  lastCommand?: string;
  /** Milisegundos desde que arrancó la tarea actual (0 si no hay). */
  taskElapsedMs: number;
  lastResponse?: string;
};

export type CommandLog = {
  id: string;
  command: string;
  response: string;
  timestamp: string;
  type: "info" | "success" | "error" | "system";
};

export type Subtask = {
  label: string;
  done: boolean;
};

export type TaskInfo = {
  id: string;
  title: string;
  subtasks: Subtask[];
  progress: number; // 0..100
  result?: string;
  error?: string;
};

/** Foto completa del agente que consumen los hooks de UI. */
export type AgentSnapshot = {
  status: AgentStatus;
  task: TaskInfo | null;
  logs: CommandLog[];
};
