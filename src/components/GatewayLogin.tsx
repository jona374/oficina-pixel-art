"use client";

import { useState } from "react";
import { useGatewayAuth } from "@/hooks/useGatewayAuth";
import { JarvisSprite } from "./JarvisCharacter";

const BOOT_LINES = [
  { text: "[ OK ] núcleo openclaw cargado", delay: 0 },
  { text: "[ OK ] renderizador pixel-office listo", delay: 0.25 },
  { text: "[ OK ] módulos: memory · tools · browser · status", delay: 0.5 },
  { text: "[ .. ] esperando gateway token", delay: 0.75 },
];

export default function GatewayLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { authState, login } = useGatewayAuth();
  const [token, setToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(token);
    if (ok) onAuthenticated();
  };

  const validating = authState === "validating";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="screen-scanlines" />

      <div className="w-full max-w-md">
        {/* secuencia de arranque */}
        <div className="mb-4 space-y-1 font-term text-[15px] leading-tight text-[var(--text-low)]">
          {BOOT_LINES.map((l) => (
            <p key={l.text} className="boot-line" style={{ animationDelay: `${l.delay}s` }}>
              {l.text}
            </p>
          ))}
        </div>

        <div className="retro-panel retro-corners p-8">
          <div className="text-center mb-8">
            {/* avatar con halo */}
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="avatar-halo absolute -inset-3" />
              <div className="relative w-10 aspect-[22/34] mx-auto anim-bob">
                <div className="sprite-shadow" />
                <JarvisSprite />
              </div>
            </div>

            <h1 className="panel-title text-[13px] text-glow mb-2">
              JARVIS · OPENCLAW
            </h1>
            <p className="text-[9px] tracking-[0.2em] text-[var(--text-low)] uppercase">
              Centro de operaciones — v0.1
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-2">
              <span className="text-[8px] tracking-[0.2em] text-[var(--green)]">
                ▸ GATEWAY TOKEN
              </span>
              <div className="flex items-center gap-2 bg-[var(--bg-inset)] border border-[var(--border-mid)] px-3 focus-within:border-[var(--green-dim)] focus-within:shadow-[0_0_12px_var(--green-glow)] transition-shadow">
                <span className="text-[var(--green-dim)] text-[11px]">$</span>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="••••••••"
                  disabled={validating}
                  className="w-full bg-transparent py-2.5 font-term text-[17px] text-[var(--green)] placeholder-[var(--text-low)] outline-none caret-[var(--green)]"
                  autoFocus
                />
              </div>
            </label>

            {authState === "invalid" && (
              <p className="text-[9px] text-[var(--red)] anim-error tracking-wide">
                ✗ TOKEN INVÁLIDO — mínimo 4 caracteres
              </p>
            )}

            <button
              type="submit"
              disabled={validating || token.length === 0}
              className="btn-retro w-full py-3 text-[10px]"
            >
              {validating ? "► VALIDANDO…" : "► CONECTAR"}
            </button>
          </form>

          <p className="mt-6 text-[8px] tracking-wider text-[var(--text-low)] text-center">
            MODO DEMO · CUALQUIER TOKEN DE 4+ CARACTERES
          </p>
        </div>
      </div>
    </div>
  );
}
