"use client";

import { useCallback, useRef, useState } from "react";
import { clearConsole, sendCommand } from "@/lib/openclawClient";
import { parseCommand } from "@/lib/commandParser";

export function useCommandConsole() {
  const [history, setHistory] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const historyIndex = useRef(-1);

  const submit = useCallback(async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setHistory((h) => [...h, trimmed]);
    historyIndex.current = -1;

    const { name } = parseCommand(trimmed);
    if (name === "clear") {
      clearConsole();
      return;
    }

    setBusy(true);
    try {
      await sendCommand(trimmed);
    } finally {
      setBusy(false);
    }
  }, []);

  /** Navegación con flechas ↑/↓ por el historial. */
  const navigate = useCallback(
    (direction: "up" | "down"): string | null => {
      if (history.length === 0) return null;
      if (direction === "up") {
        historyIndex.current =
          historyIndex.current === -1
            ? history.length - 1
            : Math.max(0, historyIndex.current - 1);
      } else {
        if (historyIndex.current === -1) return null;
        historyIndex.current++;
        if (historyIndex.current >= history.length) {
          historyIndex.current = -1;
          return "";
        }
      }
      return history[historyIndex.current] ?? null;
    },
    [history]
  );

  return { submit, busy, history, navigate };
}
