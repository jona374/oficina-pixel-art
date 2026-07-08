"use client";

import { useEffect, useRef, useState } from "react";

export type PanelKey = "console" | "status" | "tasks" | "agents" | "settings";

const ITEMS: { key: PanelKey | "close"; label: string; icon: string }[] = [
  { key: "console", label: "Consola", icon: "▸" },
  { key: "status", label: "Estado", icon: "◆" },
  { key: "tasks", label: "Tareas", icon: "✚" },
  { key: "agents", label: "Agentes", icon: "☰" },
  { key: "agents", label: "Skills", icon: "✦" },
  { key: "settings", label: "Ajustes", icon: "⚙" },
  { key: "close", label: "Cerrar paneles", icon: "✕" },
];

/** Botón flotante que abre el menú compacto de paneles. */
export default function ImmersiveMenu({
  onPick,
  onCloseAll,
}: {
  onPick: (key: PanelKey) => void;
  onCloseAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // cerrar el menú al tocar fuera
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref}>
      <button
        className="menu-fab rpg-panel rounded-full text-[18px] text-[#f0cf7a]"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="menu-list rpg-panel rpg-anim-in rounded-md p-1.5 space-y-0.5">
          {ITEMS.map((it, i) => (
            <button
              key={`${it.key}-${i}`}
              className="menu-item rpg-title text-[10px] px-2.5 py-2 rounded"
              onClick={() => {
                setOpen(false);
                if (it.key === "close") onCloseAll();
                else onPick(it.key);
              }}
            >
              <span className="text-[#c9a04a] w-4 text-center">{it.icon}</span>
              <span className="text-[#e8d6a8]">{it.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
