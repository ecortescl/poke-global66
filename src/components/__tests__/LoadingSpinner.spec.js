import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../ui/LoadingSpinner.vue'

describe('LoadingSpinner Component', () => {
  it('debe renderizar correctamente', () => {
    const wrapper = mount(LoadingSpinner)

    expect(wrapper.find('.pokeball-container').exists()).toBe(true)
    expect(wrapper.find('.animate-bounce').exists()).toBe(true)
  })

  it('debe mostrar el texto por defecto', () => {
    const wrapper = mount(LoadingSpinner)

    expect(wrapper.text()).toContain('Cargando Pokémon...')
  })

  it('debe aceptar texto personalizado', () => {
    const customText = 'Buscando Pokemon...'
    const wrapper = mount(LoadingSpinner, {
      props: {
        loadingText: customText,
      },
    })

    expect(wrapper.text()).toContain(customText)
  })

  it('debe mostrar las animaciones de pokeball', () => {
    const wrapper = mount(LoadingSpinner)

    expect(wrapper.find('.pokeball-top').exists()).toBe(true)
    expect(wrapper.find('.pokeball-bottom').exists()).toBe(true)
    expect(wrapper.find('.pokeball-middle').exists()).toBe(true)
    expect(wrapper.find('.pokeball-button').exists()).toBe(true)
  })

  it('debe mostrar los puntos animados', () => {
    const wrapper = mount(LoadingSpinner)

    const animatedDots = wrapper.findAll('.animate-ping')
    expect(animatedDots).toHaveLength(3)
  })

  it('debe aplicar clases CSS correctas', () => {
    const wrapper = mount(LoadingSpinner)

    // Verificar el overlay principal
    expect(wrapper.classes()).toContain('fixed')
    expect(wrapper.classes()).toContain('inset-0')
    expect(wrapper.classes()).toContain('flex')

    // Verificar la animación de texto
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })

  it('debe tener la estructura correcta del overlay', () => {
    const wrapper = mount(LoadingSpinner)

    expect(wrapper.classes()).toContain('bg-black')
    expect(wrapper.classes()).toContain('bg-opacity-50')
    expect(wrapper.find('.text-center').exists()).toBe(true)
  })
})
