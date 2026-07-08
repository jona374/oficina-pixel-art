"use client";

import { useEffect, useRef, useState } from "react";
import type { SheetAnimName, SheetCharacterConfig } from "./types";
import SheetSprite from "./SheetSprite";

/**
 * Controlador genérico de un personaje de spritesheet: máquina de
 * estados idle/walk con reproducción por frames (frame+1 % frames),
 * nunca se congela. La posición la maneja quien lo usa (vida de
 * oficina); aquí solo se anima y voltea según la mirada.
 */
export default function SheetCharacter({
  config,
  walking,
  facing = "right",
}: {
  config: SheetCharacterConfig;
  walking?: boolean;
  facing?: "left" | "right";
}) {
  const anim: SheetAnimName = walking ? "walk" : "idle";
  const [frame, setFrame] = useState(0);
  const animRef = useRef(anim);
  animRef.current = anim;

  useEffect(() => {
    const def = config.animations[anim];
    let f = 0;
    setFrame(0);
    const id = setInterval(() => {
      f = (f + 1) % def.frames;
      setFrame(f);
    }, 1000 / def.fps);
    return () => clearInterval(id);
  }, [anim, config]);

  return <SheetSprite config={config} anim={anim} frame={frame} facing={facing} />;
}

/** Dirección de mirada según el movimiento horizontal. */
export function useFacing(x: number): "left" | "right" {
  const prev = useRef(x);
  const facing = useRef<"left" | "right">("right");
  if (x < prev.current - 0.05) facing.current = "left";
  else if (x > prev.current + 0.05) facing.current = "right";
  prev.current = x;
  return facing.current;
}
