"use client";

import { useEffect } from "react";

/** Ventana flotante genérica (dock derecha en desktop, bottom sheet en
 *  móvil) para consola / estado / tareas / agentes / ajustes. */
export default function FloatingPanel({
  title,
  onClose,
  children,
  bodyClassName = "",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  bodyClassName?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="rpg-scrim" onClick={onClose} aria-hidden />
      <section
        className="rpg-panel rpg-anim-in floating-dock rounded-md min-h-0"
        role="dialog"
        aria-label={title}
      >
        <header className="flex items-center justify-between px-4 py-2.5 shrink-0">
          <h2 className="rpg-title text-[11px] tracking-widest">▸ {title.toUpperCase()}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar panel"
            className="rpg-btn w-6 h-6 flex items-center justify-center text-[12px] rounded"
          >
            ✕
          </button>
        </header>
        <div className="rpg-divider mx-3 shrink-0" />
        <div className={`min-h-0 flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>
      </section>
    </>
  );
}
