import type { JSX } from "react";

/**
 * Renderizador de sprites por matriz de píxeles.
 *
 * Cada fila del sprite es un string donde cada carácter es un píxel y
 * se mapea a un color por la paleta ('.' o ' ' = transparente). Esto
 * permite dibujar siluetas orgánicas fila a fila, exactamente como un
 * sprite sheet real, en lugar de apilar rectángulos.
 *
 * Los tramos horizontales del mismo color se fusionan en un solo rect
 * para mantener el DOM ligero.
 */
export function PixelGrid({
  rows,
  palette,
  x = 0,
  y = 0,
}: {
  rows: string[];
  palette: Record<string, string>;
  x?: number;
  y?: number;
}) {
  const rects: JSX.Element[] = [];
  rows.forEach((row, ry) => {
    let cx = 0;
    while (cx < row.length) {
      const ch = row[cx];
      if (ch === "." || ch === " ") {
        cx++;
        continue;
      }
      let run = 1;
      while (cx + run < row.length && row[cx + run] === ch) run++;
      const color = palette[ch];
      if (color) {
        rects.push(
          <rect key={`${ry}-${cx}`} x={x + cx} y={y + ry} width={run} height={1} fill={color} />
        );
      }
      cx += run;
    }
  });
  return <>{rects}</>;
}
