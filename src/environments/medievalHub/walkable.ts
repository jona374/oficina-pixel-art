/**
 * Zona caminable del hub medieval, como polígono en % sobre la imagen.
 * Traza el piso de madera (rombo isométrico + extensión de la zona de
 * estudio a la derecha), dejando fuera paredes, barra, cama, escaleras
 * y el exterior. El control manual y el click-to-move validan contra
 * este polígono para que nadie camine sobre muebles/paredes ni salga
 * del piso.
 */
export const FLOOR_POLYGON: [number, number][] = [
  [19, 64],
  [31, 55],
  [45, 49],
  [58, 48],
  [82, 58],
  [80, 68],
  [62, 84],
  [46, 91],
  [30, 82],
];

/** Ray casting: ¿el punto (x,y) en % está dentro del piso caminable? */
export function isWalkable(x: number, y: number): boolean {
  let inside = false;
  const p = FLOOR_POLYGON;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i];
    const [xj, yj] = p[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
