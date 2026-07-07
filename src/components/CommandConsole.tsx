"use client";

import { useEffect, useRef, useState } from "react";
import type { CommandLog } from "@/types/agent";
import { useCommandConsole } from "@/hooks/useCommandConsole";
import { clearConsole } from "@/lib/openclawClient";

const TYPE_COLOR: Record<CommandLog["type"], string> = {
  info: "text-crt-green",
  success: "text-crt-green",
  error: "text-crt-red",
  system: "text-crt-amber",
};

export default function CommandConsole({ logs }: { logs: CommandLog[] }) {
  const { submit, busy, navigate } = useCommandConsole();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [logs]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !busy) {
      const value = input;
      setInput("");
      void submit(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = navigate("up");
      if (prev !== null) setInput(prev);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = navigate("down");
      if (next !== null) setInput(next);
    }
  };

  return (
    <section className="flex flex-col bg-crt-panel border-2 border-crt-border h-full min-h-0">
      <header className="flex items-center justify-between px-3 py-1.5 border-b-2 border-crt-border">
        <h2 className="text-[10px] text-crt-green tracking-widest">▸ CONSOLA</h2>
        <button
          onClick={clearConsole}
          className="text-[9px] px-2 py-0.5 border border-crt-border text-gray-400 hover:text-crt-green hover:border-crt-green transition-colors"
        >
          LIMPIAR
        </button>
      </header>

      <div
        ref={scrollRef}
        className="console-scroll flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2 text-[11px] leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {logs.length === 0 && (
          <p className="text-gray-500">
            Escribe <span className="text-crt-green">help</span> para ver los
            comandos disponibles.
          </p>
        )}
        {logs.map((log) => (
          <div key={log.id}>
            {log.command && (
              <p className="text-gray-400">
                <span className="text-crt-purple">jarvis@openclaw</span>
                <span className="text-gray-600">:~$ </span>
                <span className="text-white">{log.command}</span>
              </p>
            )}
            <pre className={`whitespace-pre-wrap font-pixel ${TYPE_COLOR[log.type]}`}>
              {log.response}
            </pre>
          </div>
        ))}
        {busy && <p className="text-crt-amber anim-blink">Jarvis está pensando…</p>}
      </div>

      <div className="flex items-center gap-2 px-3 py-2 border-t-2 border-crt-border">
        <span className="text-crt-purple text-[11px] shrink-0">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          placeholder={busy ? "ejecutando…" : "status | run task <texto> | help"}
          className="flex-1 bg-transparent text-[11px] text-crt-green placeholder-gray-600 outline-none font-pixel"
          autoFocus
          spellCheck={false}
        />
      </div>
    </section>
  );
}
