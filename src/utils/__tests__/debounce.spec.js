import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, debounceAdvanced } from '../debounce'

describe('Utilidades de Debounce', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('debounce', () => {
    it('debe ejecutar la función después del delay especificado', () => {
      const mockFunction = vi.fn()
      const debouncedFunction = debounce(mockFunction, 300)

      debouncedFunction('test')
      expect(mockFunction).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(mockFunction).toHaveBeenCalledWith('test')
      expect(mockFunction).toHaveBeenCalledTimes(1)
    })

    it('debe cancelar ejecuciones anteriores si se llama múltiples veces', () => {
      const mockFunction = vi.fn()
      const debouncedFunction = debounce(mockFunction, 300)

      debouncedFunction('test1')
      vi.advanceTimersByTime(100)

      debouncedFunction('test2')
      vi.advanceTimersByTime(100)

      debouncedFunction('test3')
      vi.advanceTimersByTime(300)

      expect(mockFunction).toHaveBeenCalledTimes(1)
      expect(mockFunction).toHaveBeenCalledWith('test3')
    })

    it('debe mantener el contexto correcto', () => {
      const obj = {
        value: 'test',
        method: vi.fn(function () {
          return this.value
        }),
      }

      const debouncedMethod = debounce(obj.method, 100)
      debouncedMethod.call(obj)

      vi.advanceTimersByTime(100)

      expect(obj.method).toHaveBeenCalledTimes(1)
    })

    it('debe pasar todos los argumentos correctamente', () => {
      const mockFunction = vi.fn()
      const debouncedFunction = debounce(mockFunction, 100)

      debouncedFunction('arg1', 'arg2', 'arg3')
      vi.advanceTimersByTime(100)

      expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
    })
  })

  describe('debounceAdvanced', () => {
    it('debe ejecutar inmediatamente con leading=true', () => {
      const mockFunction = vi.fn()
      const debouncedFunction = debounceAdvanced(mockFunction, 300, { leading: true })

      debouncedFunction('test')
      expect(mockFunction).toHaveBeenCalledTimes(1)
      expect(mockFunction).toHaveBeenCalledWith('test')

      vi.advanceTimersByTime(300)
      expect(mockFunction).toHaveBeenCalledTimes(1)
    })

    it('no debe ejecutar al final con trailing=false', () => {
      const mockFunction = vi.fn()
      const debouncedFunction = debounceAdvanced(mockFunction, 300, { trailing: false })

      debouncedFunction('test')
      vi.advanceTimersByTime(300)

      expect(mockFunction).not.toHaveBeenCalled()
    })

    it('debe ejecutar tanto al inicio como al final con leading=true y trailing=true', () => {
      const mockFunction = vi.fn()
      const debouncedFunction = debounceAdvanced(mockFunction, 300, {
        leading: true,
        trailing: true,
      })

      debouncedFunction('test1')
      expect(mockFunction).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(100)
      debouncedFunction('test2')

      vi.advanceTimersByTime(300)
      expect(mockFunction).toHaveBeenCalledTimes(2)
    })

    it('debe usar los valores por defecto correctos', () => {
      const mockFunction = vi.fn()
      const debouncedFunction = debounceAdvanced(mockFunction, 300)

      debouncedFunction('test')
      expect(mockFunction).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(mockFunction).toHaveBeenCalledTimes(1)
    })
  })
})
