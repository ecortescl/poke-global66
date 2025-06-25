import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchInput from '../ui/SearchInput.vue'

describe('SearchInput Component', () => {
  it('debe renderizar correctamente', () => {
    const wrapper = mount(SearchInput)

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true) // Ícono de búsqueda
  })

  it('debe emitir update:modelValue cuando el usuario escribe', async () => {
    const wrapper = mount(SearchInput)
    const input = wrapper.find('input')

    await input.setValue('pikachu')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['pikachu'])
  })

  it('debe mostrar el placeholder por defecto', () => {
    const wrapper = mount(SearchInput)
    const input = wrapper.find('input')

    expect(input.attributes('placeholder')).toBe('Buscar...')
  })

  it('debe aceptar un placeholder personalizado', () => {
    const customPlaceholder = 'Buscar tu Pokemon favorito'
    const wrapper = mount(SearchInput, {
      props: {
        placeholder: customPlaceholder,
      },
    })
    const input = wrapper.find('input')

    expect(input.attributes('placeholder')).toBe(customPlaceholder)
  })

  it('debe reflejar el valor del prop modelValue', async () => {
    const wrapper = mount(SearchInput, {
      props: {
        modelValue: 'charizard',
      },
    })
    const input = wrapper.find('input')

    expect(input.element.value).toBe('charizard')
  })

  it('debe emitir update:modelValue al escribir', async () => {
    const wrapper = mount(SearchInput, {
      props: {
        modelValue: '',
      },
    })
    const input = wrapper.find('input')

    await input.setValue('bulbasaur')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['bulbasaur'])
  })

  it('debe manejar la limpieza del input', async () => {
    const wrapper = mount(SearchInput, {
      props: {
        modelValue: 'pikachu',
      },
    })
    const input = wrapper.find('input')

    await input.setValue('')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue').pop()).toEqual([''])
  })

  it('debe emitir eventos de focus y blur', async () => {
    const wrapper = mount(SearchInput)
    const input = wrapper.find('input')

    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()

    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('debe cambiar las clases cuando está enfocado', async () => {
    const wrapper = mount(SearchInput)
    const input = wrapper.find('input')

    await input.trigger('focus')
    await wrapper.vm.$nextTick()

    expect(input.classes()).toContain('border-blue-500')
  })

  it('debe emitir evento search con debounce', async () => {
    vi.useFakeTimers()

    const wrapper = mount(SearchInput)
    const input = wrapper.find('input')

    await input.setValue('test')

    // Avanzar los timers para activar el debounce
    vi.advanceTimersByTime(300)

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0]).toEqual(['test'])

    vi.useRealTimers()
  })
})
