"use client";

import { useRef, useState } from "react";
import type { Vec } from "@/hooks/useManualControl";

/** Joystick táctil (también funciona con mouse). Emite un vector
 *  normalizado [-1,1] mientras se arrastra; null al soltar. */
export default function Joystick({ onChange }: { onChange: (v: Vec | null) => void }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<Vec>({ x: 0, y: 0 });
  const active = useRef(false);

  const R = 34; // radio máximo del knob en px

  const update = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const d = Math.hypot(dx, dy);
    const clamped = Math.min(d, R);
    if (d > 0) {
      dx = (dx / d) * clamped;
      dy = (dy / d) * clamped;
    }
    setKnob({ x: dx, y: dy });
    onChange({ x: dx / R, y: dy / R });
  };

  const start = (e: React.PointerEvent) => {
    active.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    update(e.clientX, e.clientY);
  };
  const move = (e: React.PointerEvent) => {
    if (active.current) update(e.clientX, e.clientY);
  };
  const end = () => {
    active.current = false;
    setKnob({ x: 0, y: 0 });
    onChange(null);
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      className="relative rounded-full touch-none select-none"
      style={{
        width: 96,
        height: 96,
        background: "radial-gradient(circle, rgba(40,30,20,.9), rgba(20,15,10,.9))",
        border: "2px solid #7a5a2e",
        boxShadow: "inset 0 0 12px rgba(0,0,0,.6), 0 0 0 2px rgba(0,0,0,.4)",
      }}
      aria-label="Joystick de movimiento"
      role="application"
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 44,
          height: 44,
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
          background: "radial-gradient(circle, #e0b860, #a77f2a)",
          border: "2px solid #f0cf7a",
          boxShadow: "0 2px 6px rgba(0,0,0,.5)",
        }}
      />
    </div>
  );
}
