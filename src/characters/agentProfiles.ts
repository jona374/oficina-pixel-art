/**
 * Fichas de agente (perfil + skills) de cada habitante del hub.
 * Se muestran en el panel RPG al tocar/clic un personaje.
 *
 * Para agregar un agente nuevo: añade una entrada aquí con el mismo id
 * que su habitante en `medievalHub/config.ts`. Para agregar un skill:
 * súmalo al array `skills` del agente. El orden y el on/off del usuario
 * se guardan en localStorage por agente (ver CharacterInfoPanel).
 */

export type SkillType = "core" | "support" | "utility" | "passive";

export type AgentSkill = {
  id: string;
  name: string;
  type: SkillType;
  level: number;
  description: string;
  enabled: boolean;
};

export type AgentProfile = {
  id: string;
  name: string;
  role: string;
  title: string;
  level: number;
  description: string;
  skills: AgentSkill[];
};

const s = (
  id: string,
  name: string,
  type: SkillType,
  level: number,
  description: string,
  enabled = true
): AgentSkill => ({ id, name, type, level, description, enabled });

export const AGENT_PROFILES: Record<string, AgentProfile> = {
  jarvis: {
    id: "jarvis", name: "Jarvis", role: "Coordinador principal", title: "Core Agent",
    level: 5,
    description:
      "Agente central que coordina tareas, ejecuta comandos y se comunica con OpenClaw.",
    skills: [
      s("task-runner", "Task Runner", "core", 5, "Ejecuta tareas y coordina acciones del sistema."),
      s("console-link", "Console Link", "utility", 4, "Conecta la consola con el flujo de comandos."),
      s("patrol", "Patrol", "passive", 3, "Recorre el hub supervisando a los agentes."),
    ],
  },
  oracle: {
    id: "oracle", name: "Oracle", role: "Análisis y predicción", title: "Mystic Analyst",
    level: 4,
    description: "Agente orientado a análisis, interpretación y apoyo estratégico.",
    skills: [
      s("vision", "Visión", "core", 4, "Detecta patrones y sugiere próximos pasos."),
      s("ritual-focus", "Ritual Focus", "passive", 3, "Aumenta la concentración cuando Jarvis piensa."),
      s("deep-memory", "Memoria Profunda", "support", 3, "Recupera contexto histórico relevante."),
    ],
  },
  openclaw: {
    id: "openclaw", name: "OpenClaw", role: "Núcleo del sistema", title: "Gateway Core",
    level: 5,
    description: "El núcleo: autentica, enruta modelos y controla el flujo de tokens.",
    skills: [
      s("gateway-auth", "Gateway Auth", "core", 5, "Valida el token y abre la sesión."),
      s("model-router", "Model Router", "core", 4, "Elige y enruta al modelo adecuado."),
      s("token-ledger", "Token Ledger", "utility", 4, "Contabiliza el uso de tokens y contexto."),
    ],
  },
  knight: {
    id: "knight", name: "Free Knight", role: "Guardia del hub", title: "Sentinel",
    level: 3,
    description: "Vigila la entrada y escolta operaciones sensibles.",
    skills: [
      s("watch", "Guardia", "passive", 3, "Mantiene vigilancia constante del área."),
      s("escort", "Escolta", "support", 2, "Acompaña y protege otras tareas."),
    ],
  },
  memory: {
    id: "memory", name: "Memory", role: "Archivo e historial", title: "Archivist",
    level: 4,
    description: "Ordena, indexa y recupera la memoria del sistema.",
    skills: [
      s("recall", "Recall", "core", 4, "Recupera datos y conversaciones anteriores."),
      s("index", "Indexado", "utility", 3, "Clasifica y ordena la información nueva."),
      s("history", "Historial", "support", 3, "Mantiene la línea de tiempo de eventos."),
    ],
  },
  status: {
    id: "status", name: "Status", role: "Monitoreo del sistema", title: "Watchtower",
    level: 3,
    description: "Observa métricas y estado general en tiempo real.",
    skills: [
      s("metrics", "Métricas", "core", 3, "Lee el estado y las cifras del sistema."),
      s("alerts", "Alertas", "support", 2, "Avisa cuando algo se sale de rango."),
    ],
  },
  browser: {
    id: "browser", name: "Browser", role: "Investigación y búsqueda", title: "Scout",
    level: 3,
    description: "Explora, busca y consulta información externa.",
    skills: [
      s("web-search", "Búsqueda Web", "core", 3, "Encuentra información en la web."),
      s("read", "Lectura", "utility", 3, "Analiza documentos y referencias."),
    ],
  },
  tools: {
    id: "tools", name: "Tools", role: "Soporte técnico", title: "Tinkerer",
    level: 3,
    description: "Repara, ajusta y calibra las herramientas del sistema.",
    skills: [
      s("repair", "Reparación", "core", 3, "Arregla y mantiene el hardware virtual."),
      s("calibrate", "Calibración", "utility", 2, "Afina el rendimiento de las utilidades."),
    ],
  },
  samurai: {
    id: "samurai", name: "Samurai", role: "Ejecución precisa", title: "Blade",
    level: 4,
    description: "Ejecuta acciones con disciplina y precisión.",
    skills: [
      s("precise-cut", "Corte Preciso", "core", 4, "Resuelve tareas de un solo golpe limpio."),
      s("discipline", "Disciplina", "passive", 3, "Mantiene el foco bajo presión."),
    ],
  },
  wizard: {
    id: "wizard", name: "Wizard", role: "Operaciones arcanas", title: "Wanderer Mage",
    level: 4,
    description: "Transforma datos con hechizos y cargas de energía.",
    skills: [
      s("spell", "Hechizo", "core", 4, "Aplica transformaciones complejas."),
      s("charge", "Carga Arcana", "support", 3, "Acumula energía para acciones grandes."),
    ],
  },
  minotaur: {
    id: "minotaur", name: "Minotaur", role: "Fuerza bruta", title: "Warden",
    level: 4,
    description: "Aborda las cargas más pesadas del sistema.",
    skills: [
      s("charge-hit", "Embestida", "core", 4, "Procesa tareas de gran volumen."),
      s("endurance", "Resistencia", "passive", 3, "Sostiene procesos largos sin fallar."),
    ],
  },
  marina: {
    id: "marina", name: "Marina", role: "Fluidez y adaptación", title: "Tideborn",
    level: 3,
    description: "Se adapta al flujo del trabajo con serenidad.",
    skills: [
      s("current", "Corriente", "core", 3, "Encauza el trabajo hacia donde se necesita."),
      s("serenity", "Serenidad", "passive", 2, "Estabiliza el sistema en picos de carga."),
    ],
  },
};
