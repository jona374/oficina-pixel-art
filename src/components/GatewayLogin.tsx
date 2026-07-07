"use client";

import { useState } from "react";
import { useGatewayAuth } from "@/hooks/useGatewayAuth";

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
    <div className="min-h-screen flex items-center justify-center bg-crt-bg p-4">
      <div className="crt-frame bg-crt-panel w-full max-w-md p-8">
        <div className="text-center mb-8 space-y-2">
          <pre className="text-crt-green text-[10px] leading-tight inline-block text-left">
{` ┌─────────────────────────┐
 │  JARVIS · OPENCLAW  v0.1 │
 └─────────────────────────┘`}
          </pre>
          <p className="text-[10px] text-gray-500">
            Centro de operaciones — acceso restringido
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-[10px] text-crt-green tracking-widest">
              ▸ GATEWAY TOKEN
            </span>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="••••••••"
              disabled={validating}
              className="w-full bg-black/50 border-2 border-crt-border px-3 py-2 text-[12px] text-crt-green placeholder-gray-700 outline-none focus:border-crt-green font-pixel"
              autoFocus
            />
          </label>

          {authState === "invalid" && (
            <p className="text-[10px] text-crt-red anim-error">
              ✗ Token inválido. Debe tener al menos 4 caracteres.
            </p>
          )}

          <button
            type="submit"
            disabled={validating || token.length === 0}
            className="w-full py-2 border-2 border-crt-green text-crt-green text-[11px] tracking-widest hover:bg-crt-green hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {validating ? "VALIDANDO…" : "CONECTAR"}
          </button>
        </form>

        <p className="mt-6 text-[9px] text-gray-600 text-center">
          Modo demo: cualquier token de 4+ caracteres es válido.
        </p>
      </div>
    </div>
  );
}
