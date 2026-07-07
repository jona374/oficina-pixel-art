export type ParsedCommand = {
  name: string;
  args: string;
  raw: string;
};

export const KNOWN_COMMANDS = [
  "status",
  "run task",
  "stop",
  "clear",
  "memory",
  "logs",
  "tokens",
  "context",
  "connect",
  "help",
] as const;

/**
 * Normaliza la entrada del usuario a { name, args }.
 * "run task revisar conexión" -> { name: "run task", args: "revisar conexión" }
 */
export function parseCommand(input: string): ParsedCommand {
  const raw = input.trim();
  const lower = raw.toLowerCase();

  if (lower.startsWith("run task")) {
    return { name: "run task", args: raw.slice("run task".length).trim(), raw };
  }

  const [first, ...rest] = raw.split(/\s+/);
  return { name: (first ?? "").toLowerCase(), args: rest.join(" "), raw };
}

export function isKnownCommand(name: string): boolean {
  return (KNOWN_COMMANDS as readonly string[]).includes(name);
}
