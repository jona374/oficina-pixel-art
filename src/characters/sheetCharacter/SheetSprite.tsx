"use client";

import type { SheetAnimName, SheetCharacterConfig } from "./types";

/**
 * Renderiza un frame recortado de un spritesheet genérico.
 * Enfoca la ventana de recorte del personaje (no el frame completo)
 * con background-size/-position, escalado nearest-neighbor.
 *
 *   sheetW = frames * frameWidth
 *   X0 = frameIndex * frameWidth + crop.x
 *   bgSize = 100*sheetW/crop.w  x  100*sheetH/crop.h
 *   bgPos  = 100*X0/(sheetW-crop.w)  x  100*crop.y/(sheetH-crop.h)
 */
export default function SheetSprite({
  config,
  anim,
  frame,
  facing,
}: {
  config: SheetCharacterConfig;
  anim: SheetAnimName;
  frame: number;
  facing: "left" | "right";
}) {
  const { frameWidth, frameHeight, crop, basePath } = config;
  const def = config.animations[anim];
  const sheetW = def.frames * frameWidth;
  const sheetH = frameHeight;

  const X0 = frame * frameWidth + crop.x;
  const bgSizeW = (100 * sheetW) / crop.w;
  const bgSizeH = (100 * sheetH) / crop.h;
  const bgPosX = (100 * X0) / (sheetW - crop.w);
  const bgPosY = (100 * crop.y) / (sheetH - crop.h);

  return (
    <div
      className="w-full h-full"
      style={{
        aspectRatio: `${crop.w}/${crop.h}`,
        backgroundImage: `url(${basePath}/${def.file})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${bgSizeW}% ${bgSizeH}%`,
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        imageRendering: "pixelated",
        transform: facing === "left" ? "scaleX(-1)" : undefined,
        transformOrigin: "center bottom",
      }}
    />
  );
}
