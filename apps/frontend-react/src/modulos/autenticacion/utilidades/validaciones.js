/*
 * Validación de formato de los formularios de acceso: cerca de la persona, para
 * que no espere al servidor por un campo vacío. La última palabra la tiene el
 * backend.
 */

const PATRON_DE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LARGO_MAXIMO_DE_CORREO = 150

/** El error del campo de correo, o '' si está bien. */
export function validarCorreo(correo) {
  const limpio = correo.trim()
  if (!limpio) return 'Escribe tu correo.'
  if (!PATRON_DE_CORREO.test(limpio)) return 'Ese correo no parece válido.'
  return ''
}

/** `mensaje` si el campo quedó vacío, o '' si tiene algo. */
export const validarObligatorio = (valor, mensaje) => (valor.trim() ? '' : mensaje)
