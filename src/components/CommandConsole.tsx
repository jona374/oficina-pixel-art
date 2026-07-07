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
    <section className="retro-panel retro-corners flex flex-col h-full min-h-0">
      <header className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-dim)]">
        <h2 className="panel-title">▸ CONSOLA</h2>
        <button
          onClick={clearConsole}
          className="btn-retro text-[8px] px-2.5 py-1"
        >
          LIMPIAR
        </button>
      </header>

      <div
        ref={scrollRef}
        className="console-scroll flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-2 font-term text-[16px] leading-snug"
        onClick={() => inputRef.current?.focus()}
      >
        {logs.length === 0 && (
          <p className="text-[var(--text-low)]">
            Escribe <span className="text-[var(--green)]">help</span> para ver los
            comandos disponibles.
          </p>
        )}
        {logs.map((log) => (
          <div key={log.id}>
            {log.command && (
              <p className="text-[var(--text-mid)]">
                <span className="text-[var(--purple)]">jarvis@openclaw</span>
                <span className="text-[var(--text-low)]">:~$ </span>
                <span className="text-[var(--text-hi)]">{log.command}</span>
              </p>
            )}
            <pre className={`whitespace-pre-wrap font-term ${TYPE_COLOR[log.type]}`}>
              {log.response}
            </pre>
          </div>
        ))}
        {busy && (
          <p className="text-[var(--amber)] anim-blink">Jarvis está pensando…</p>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-t border-[var(--border-dim)] bg-[var(--bg-inset)]">
        <span className="text-[var(--purple)] font-term text-[16px] shrink-0">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          placeholder={busy ? "ejecutando…" : "status | run task <texto> | help"}
          className="flex-1 bg-transparent font-term text-[16px] text-[var(--green)] placeholder-[var(--text-low)] outline-none caret-[var(--green)]"
          autoFocus
          spellCheck={false}
        />
      </div>
    </section>
  );
}
