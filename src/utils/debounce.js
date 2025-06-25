/**
 * Utilidad de debounce para retrasar la ejecución de funciones
 * Principio SOLID: Single Responsibility - Solo maneja el debounce
 */

/**
 * Crea una función debounced que retrasa la ejecución hasta que hayan pasado
 * los milisegundos especificados desde la última vez que fue invocada
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Tiempo de espera en milisegundos
 * @returns {Function} Función debounced
 */
export function debounce(func, delay) {
  let timeoutId = null

  return function debounced(...args) {
    // Limpiar timeout anterior si existe
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    // Configurar nuevo timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Versión más avanzada de debounce con opciones adicionales
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Tiempo de espera en milisegundos
 * @param {Object} options - Opciones adicionales
 * @param {boolean} options.leading - Ejecutar en el borde inicial
 * @param {boolean} options.trailing - Ejecutar en el borde final
 * @returns {Function} Función debounced
 */
export function debounceAdvanced(func, delay, options = {}) {
  const { leading = false, trailing = true } = options
  let timeoutId = null
  let lastCallTime = null
  let lastInvokeTime = 0

  return function debounced(...args) {
    const now = Date.now()
    const isInvoking = lastCallTime === null

    lastCallTime = now

    if (isInvoking && leading) {
      lastInvokeTime = now
      return func.apply(this, args)
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (trailing && lastCallTime !== null) {
        lastInvokeTime = now
        func.apply(this, args)
      }
      timeoutId = null
      lastCallTime = null
    }, delay)
  }
}

export default debounce
