/**
 * Escala visual ESTÁNDAR de los personajes de la oficina.
 *
 * Regla: todos los personajes adultos deben verse de un tamaño
 * similar. Para lograrlo NO se escala el frame completo (cada
 * spritesheet trae distinto margen vacío), sino que se normaliza por
 * la ALTURA VISIBLE REAL del personaje dentro de su recorte.
 *
 * `ADULT_CHAR_HEIGHT_PCT` = altura visible objetivo del personaje,
 * expresada como % del ANCHO del mapa (los contenedores se dimensionan
 * por width%). Está calibrada a partir del Free Knight ya integrado.
 *
 * Para integrar un personaje NUEVO de spritesheet:
 *   mapWidthPct = adultBoxWidthPct(cropW, cropH)
 * y así queda automáticamente a la misma altura que los demás adultos.
 */
export const ADULT_CHAR_HEIGHT_PCT = 9.7;

/**
 * Devuelve el ancho (%) del contenedor para que la altura visible del
 * personaje sea `heightPct`, dado el aspecto visible real (recorte).
 */
export function adultBoxWidthPct(
  visibleW: number,
  visibleH: number,
  heightPct = ADULT_CHAR_HEIGHT_PCT
): number {
  return heightPct * (visibleW / visibleH);
}
