"use client";

import { useEffect, useMemo, useState } from "react";
import type { AgentProfile, AgentSkill, SkillType } from "@/characters/agentProfiles";

const TYPE_COLOR: Record<SkillType, string> = {
  core: "#e0736a",
  support: "#7ea8e0",
  utility: "#f0cf7a",
  passive: "#9a8fc0",
};

type StoredSkill = { id: string; enabled: boolean };
const storeKey = (agentId: string) => `agent-skills-${agentId}`;

/** Reconstruye los skills aplicando el orden y on/off guardados. */
function loadSkills(profile: AgentProfile): AgentSkill[] {
  if (typeof window === "undefined") return profile.skills;
  try {
    const raw = window.localStorage.getItem(storeKey(profile.id));
    if (!raw) return profile.skills;
    const stored: StoredSkill[] = JSON.parse(raw);
    const byId = new Map(profile.skills.map((sk) => [sk.id, sk]));
    const ordered: AgentSkill[] = [];
    for (const st of stored) {
      const base = byId.get(st.id);
      if (base) {
        ordered.push({ ...base, enabled: st.enabled });
        byId.delete(st.id);
      }
    }
    // skills nuevos que aún no estaban guardados van al final
    Array.from(byId.values()).forEach((left) => ordered.push(left));
    return ordered;
  } catch {
    return profile.skills;
  }
}

function saveSkills(agentId: string, skills: AgentSkill[]) {
  try {
    const data: StoredSkill[] = skills.map((sk) => ({ id: sk.id, enabled: sk.enabled }));
    window.localStorage.setItem(storeKey(agentId), JSON.stringify(data));
  } catch {
    /* localStorage no disponible: se mantiene solo en memoria */
  }
}

export default function CharacterInfoPanel({
  profile,
  liveStatus,
  statusColor,
  sprite,
  onClose,
}: {
  profile: AgentProfile;
  liveStatus: string;
  statusColor: string;
  sprite?: React.ReactNode;
  onClose: () => void;
}) {
  const [skills, setSkills] = useState<AgentSkill[]>(profile.skills);

  // cargar orden/estado guardado al abrir cada personaje
  useEffect(() => {
    setSkills(loadSkills(profile));
  }, [profile]);

  // cerrar con Escape (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const update = (next: AgentSkill[]) => {
    setSkills(next);
    saveSkills(profile.id, next);
  };
  const toggle = (i: number) =>
    update(skills.map((sk, j) => (j === i ? { ...sk, enabled: !sk.enabled } : sk)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= skills.length) return;
    const next = [...skills];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };

  const activeCount = useMemo(() => skills.filter((sk) => sk.enabled).length, [skills]);

  return (
    <>
      <div className="rpg-scrim" onClick={onClose} aria-hidden />
      <section
        className="rpg-panel rpg-anim-in character-info-panel rounded-md"
        role="dialog"
        aria-label={`Ficha de ${profile.name}`}
      >
        {/* encabezado */}
        <header className="relative p-4 pb-3">
          <button
            onClick={onClose}
            aria-label="Cerrar ficha"
            className="rpg-btn absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-[12px] rounded"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            {sprite && (
              <div className="w-12 h-14 flex items-end justify-center shrink-0 overflow-visible">
                {sprite}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="rpg-title text-[15px] leading-none mb-1 truncate">{profile.name}</h2>
              <p className="text-[13px] text-[#c9b892] font-term leading-none">
                {profile.title} · Nv. {String(profile.level).padStart(2, "0")}
              </p>
            </div>
          </div>
        </header>

        <div className="rpg-divider mx-3" />

        {/* datos */}
        <div className="px-4 py-3 space-y-1.5 font-term text-[15px]">
          <Row label="Rol">{profile.role}</Row>
          <Row label="Estado">
            <span className="inline-flex items-center gap-1.5" style={{ color: statusColor }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
              {liveStatus}
            </span>
          </Row>
          <Row label="Skills activos">
            {activeCount} / {skills.length}
          </Row>
        </div>

        <div className="rpg-divider mx-3" />

        {/* descripción */}
        <div className="px-4 py-3">
          <p className="text-[14px] text-[#b8a988] font-term leading-snug">{profile.description}</p>
        </div>

        <div className="rpg-divider mx-3" />

        {/* skills */}
        <div className="px-4 py-3">
          <h3 className="rpg-title text-[10px] tracking-widest mb-2">▸ SKILLS</h3>
          <ul className="space-y-2">
            {skills.map((sk, i) => (
              <li
                key={sk.id}
                className={`skill-card rounded p-2 ${sk.enabled ? "" : "is-off"}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-[8px] font-pixel px-1.5 py-0.5 rounded-sm shrink-0"
                    style={{
                      color: TYPE_COLOR[sk.type],
                      border: `1px solid ${TYPE_COLOR[sk.type]}`,
                    }}
                  >
                    {sk.type.toUpperCase()}
                  </span>
                  <span className="font-term text-[15px] text-[#e8d6a8] flex-1 truncate">
                    {sk.name}
                  </span>
                  <span className="font-term text-[13px] text-[#9a8b6a] shrink-0">Lv.{sk.level}</span>
                  {/* controles */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label={`Subir ${sk.name}`}
                      className="rpg-btn w-5 h-5 text-[10px] rounded flex items-center justify-center"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === skills.length - 1}
                      aria-label={`Bajar ${sk.name}`}
                      className="rpg-btn w-5 h-5 text-[10px] rounded flex items-center justify-center"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => toggle(i)}
                      aria-label={`${sk.enabled ? "Desactivar" : "Activar"} ${sk.name}`}
                      className="rpg-btn w-9 h-5 text-[9px] font-pixel rounded flex items-center justify-center"
                      style={{
                        color: sk.enabled ? "#7ee787" : "#9a8b6a",
                        borderColor: sk.enabled ? "#3fa15a" : "#4a3820",
                      }}
                    >
                      {sk.enabled ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
                <p className="font-term text-[13px] text-[#9a8b6a] leading-snug mt-1">
                  {sk.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[#8a7a5a]">{label}</span>
      <span className="text-[#e8d6a8] text-right">{children}</span>
    </div>
  );
}
