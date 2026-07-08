"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Vec = { x: number; y: number };

const KEY_MAP: Record<string, "up" | "down" | "left" | "right"> = {
  w: "up", a: "left", s: "down", d: "right",
  W: "up", A: "left", S: "down", D: "right",
  ArrowUp: "up", ArrowLeft: "left", ArrowDown: "down", ArrowRight: "right",
};

/**
 * Control manual de un personaje seleccionado.
 *
 * - Teclado (WASD / flechas) y joystick (setJoystick) mueven en tiempo
 *   real; click-to-move (moveTo) camina hacia un punto.
 * - Cada frame aplica velocidad y valida contra `isWalkable`; si el
 *   destino no es piso, intenta deslizar por un solo eje (no atraviesa
 *   paredes ni muebles).
 * - `moving`/`facing` alimentan las animaciones (idle/walk + volteo).
 *
 * Config por personaje: `speed` (%/seg). Modular: cada habitante puede
 * pasar su propia velocidad.
 */
export function useManualControl({
  selectedId,
  startPos,
  isWalkable,
  speed = 15,
}: {
  selectedId: string | null;
  startPos: Vec | null;
  isWalkable: (x: number, y: number) => boolean;
  speed?: number;
}) {
  const [pos, setPos] = useState<Vec>(startPos ?? { x: 50, y: 70 });
  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState<"left" | "right">("right");

  const posRef = useRef<Vec>(pos);
  const keys = useRef<Set<"up" | "down" | "left" | "right">>(new Set());
  const joy = useRef<Vec | null>(null);
  const target = useRef<Vec | null>(null);

  // Reinicia al cambiar de personaje seleccionado.
  useEffect(() => {
    if (startPos) {
      posRef.current = startPos;
      setPos(startPos);
    }
    keys.current.clear();
    joy.current = null;
    target.current = null;
    setMoving(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Teclado (solo mientras hay selección).
  useEffect(() => {
    if (!selectedId) return;
    const kd = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key];
      if (!dir) return;
      // no interferir si el foco está en un input
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      keys.current.add(dir);
      target.current = null;
      e.preventDefault();
    };
    const ku = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key];
      if (dir) keys.current.delete(dir);
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      keys.current.clear();
    };
  }, [selectedId]);

  // Bucle de movimiento.
  useEffect(() => {
    if (!selectedId) {
      setMoving(false);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const step = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      let dx = 0;
      let dy = 0;
      if (joy.current) {
        dx = joy.current.x;
        dy = joy.current.y;
      } else if (keys.current.size) {
        if (keys.current.has("left")) dx -= 1;
        if (keys.current.has("right")) dx += 1;
        if (keys.current.has("up")) dy -= 1;
        if (keys.current.has("down")) dy += 1;
      } else if (target.current) {
        const tx = target.current.x - posRef.current.x;
        const ty = target.current.y - posRef.current.y;
        const d = Math.hypot(tx, ty);
        if (d < 0.8) {
          target.current = null;
        } else {
          dx = tx / d;
          dy = ty / d;
        }
      }

      const mag = Math.hypot(dx, dy);
      if (mag < 0.01) {
        setMoving(false);
        raf = requestAnimationFrame(step);
        return;
      }
      dx /= mag;
      dy /= mag;
      if (dx < -0.05) setFacing("left");
      else if (dx > 0.05) setFacing("right");

      const cur = posRef.current;
      const nx = cur.x + dx * speed * dt;
      const ny = cur.y + dy * speed * dt;
      let next = cur;
      if (isWalkable(nx, ny)) next = { x: nx, y: ny };
      else if (isWalkable(nx, cur.y)) next = { x: nx, y: cur.y };
      else if (isWalkable(cur.x, ny)) next = { x: cur.x, y: ny };

      if (next !== cur) {
        posRef.current = next;
        setPos(next);
        setMoving(true);
      } else {
        setMoving(false);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [selectedId, isWalkable, speed]);

  const setJoystick = useCallback((v: Vec | null) => {
    joy.current = v;
    if (v) target.current = null;
  }, []);

  const moveTo = useCallback(
    (x: number, y: number) => {
      if (isWalkable(x, y)) target.current = { x, y };
    },
    [isWalkable]
  );

  return { pos, moving, facing, setJoystick, moveTo };
}
