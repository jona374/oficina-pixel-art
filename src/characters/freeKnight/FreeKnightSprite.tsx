"use client";

import { FREE_KNIGHT_CONFIG, type KnightAnimName } from "./config";

/**
 * Renderiza UN frame recortado del spritesheet.
 *
 * En vez de mostrar el frame completo de 120x80 (donde el personaje se
 * ve minúsculo), enfocamos la ventana de recorte del personaje usando
 * background-size + background-position. Matemática del recorte:
 *
 *   sheetW = frames * frameWidth
 *   X0 = frameIndex * frameWidth + crop.x   (esquina del recorte)
 *   bgSize   = 100*sheetW/crop.w  x  100*sheetH/crop.h
 *   bgPos    = 100*X0/(sheetW-crop.w)  x  100*crop.y/(sheetH-crop.h)
 *
 * Así el recorte llena la caja, escalado por nearest-neighbor
 * (image-rendering: pixelated) para no perder nitidez.
 */
export default function FreeKnightSprite({
  anim,
  frame,
  facing,
}: {
  anim: KnightAnimName;
  frame: number;
  facing: "left" | "right";
}) {
  const { frameWidth, frameHeight, crop, basePath } = FREE_KNIGHT_CONFIG;
  const def = FREE_KNIGHT_CONFIG.animations[anim];
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
        // El pack solo mira a la derecha; invertimos para la izquierda.
        // El recorte está centrado en el personaje, así el volteo no lo desplaza.
        transform: facing === "left" ? "scaleX(-1)" : undefined,
        transformOrigin: "center bottom",
      }}
    />
  );
}
