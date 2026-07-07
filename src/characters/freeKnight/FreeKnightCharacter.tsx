"use client";

import { useEffect, useRef, useState } from "react";
import { FREE_KNIGHT_CONFIG, type KnightAnimName } from "./config";

/**
 * Avatar animado por spritesheet PNG (no GIF): reproduce el frame
 * actual moviendo background-position sobre la hoja. El stepping por
 * porcentaje hace que escale a cualquier tamaño sin deformarse, y
 * `image-rendering: pixelated` mantiene el pixel-art nítido.
 */
function SheetSprite({
  anim,
  frame,
  facing,
}: {
  anim: KnightAnimName;
  frame: number;
  facing: "left" | "right";
}) {
  const def = FREE_KNIGHT_CONFIG.animations[anim];
  const step = def.frames > 1 ? (frame * 100) / (def.frames - 1) : 0;
  return (
    <div
      className="w-full h-full pixelated"
      style={{
        backgroundImage: `url(${FREE_KNIGHT_CONFIG.basePath}/${def.file})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${def.frames * 100}% 100%`,
        backgroundPosition: `${step}% 0`,
        imageRendering: "pixelated",
        // El pack solo mira a la derecha: invertimos para mirar a la izquierda.
        transform: facing === "left" ? "scaleX(-1)" : undefined,
      }}
    />
  );
}

type Props = {
  /** true mientras se desplaza por la oficina. */
  walking?: boolean;
  /** Dirección de la mirada. */
  facing?: "left" | "right";
};

/** Free Knight: primer avatar de spritesheet integrado a la oficina. */
export default function FreeKnightCharacter({ walking, facing = "right" }: Props) {
  const anim: KnightAnimName = walking ? "run" : "idle";
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const def = FREE_KNIGHT_CONFIG.animations[anim];
    let f = 0;
    setFrame(0);
    const id = setInterval(() => {
      f = (f + 1) % def.frames; // ciclo continuo, nunca se congela
      setFrame(f);
    }, 1000 / def.fps);
    return () => clearInterval(id);
  }, [anim]);

  return (
    <div
      className="relative w-full"
      style={{
        aspectRatio: `${FREE_KNIGHT_CONFIG.frameWidth}/${FREE_KNIGHT_CONFIG.frameHeight}`,
      }}
    >
      {/* sombra bajo los pies (el frame trae márgenes anchos) */}
      <div className="sprite-shadow" style={{ left: "34%", width: "32%" }} />
      <SheetSprite anim={anim} frame={frame} facing={facing} />
    </div>
  );
}

/** Deriva la dirección de mirada a partir del movimiento horizontal. */
export function useFacing(x: number): "left" | "right" {
  const prev = useRef(x);
  const facing = useRef<"left" | "right">("right");
  if (x < prev.current) facing.current = "left";
  else if (x > prev.current) facing.current = "right";
  prev.current = x;
  return facing.current;
}
