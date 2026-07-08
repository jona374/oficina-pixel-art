"use client";

import { HABITANTS } from "@/environments/medievalHub/config";
import { AGENT_PROFILES } from "@/characters/agentProfiles";

/** Lista de agentes; al elegir uno se abre su ficha RPG. */
export default function AgentRoster({ onPick }: { onPick: (id: string) => void }) {
  return (
    <ul className="p-3 space-y-1.5">
      {HABITANTS.map((h) => {
        const p = AGENT_PROFILES[h.id];
        if (!p) return null;
        return (
          <li key={h.id}>
            <button
              onClick={() => onPick(h.id)}
              className="skill-card rounded p-2.5 w-full flex items-center gap-3 text-left hover:brightness-125 transition"
              aria-label={`Abrir ficha de ${p.name}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: h.color, boxShadow: `0 0 6px ${h.color}` }}
              />
              <span className="min-w-0 flex-1">
                <span className="block font-term text-[15px] text-[#e8d6a8] leading-none">
                  {p.name}
                </span>
                <span className="block font-term text-[13px] text-[#9a8b6a] leading-none mt-1 truncate">
                  {p.title} · {p.role}
                </span>
              </span>
              <span className="font-term text-[13px] text-[#9a8b6a] shrink-0">
                Nv.{String(p.level).padStart(2, "0")}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
