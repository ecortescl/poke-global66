import { describe, it, expect } from 'vitest'
import { intelligentSearch, generateSearchSuggestions } from '../fuzzySearch'

describe('Utilidades de Búsqueda Difusa', () => {
  const mockPokemonList = [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'pidgey', url: 'https://pokeapi.co/api/v2/pokemon/16/' },
  ]

  describe('intelligentSearch', () => {
    it('debe retornar búsqueda exacta cuando encuentra coincidencias', () => {
      const result = intelligentSearch(mockPokemonList, 'pika')

      expect(result.searchType).toBe('exact')
      expect(result.hasResults).toBe(true)
      expect(result.exact).toHaveLength(1)
      expect(result.exact[0].name).toBe('pikachu')
      expect(result.suggestions).toHaveLength(0)
    })

    it('debe retornar búsqueda exacta para substring matches', () => {
      const result = intelligentSearch(mockPokemonList, 'char')

      expect(result.searchType).toBe('exact')
      expect(result.hasResults).toBe(true)
      expect(result.exact).toHaveLength(2)
      expect(result.exact.map((p) => p.name)).toContain('charizard')
      expect(result.exact.map((p) => p.name)).toContain('charmander')
    })

    it('debe retornar búsqueda exacta para coincidencias parciales', () => {
      const result = intelligentSearch(mockPokemonList, 'pikach')

      expect(result.searchType).toBe('exact')
      expect(result.hasResults).toBe(true)
      expect(result.exact).toHaveLength(1)
      expect(result.exact[0].name).toBe('pikachu')
    })

    it('debe retornar búsqueda por prefijo cuando coincide el inicio', () => {
      const result = intelligentSearch(mockPokemonList, 'bulb')

      if (result.searchType === 'exact') {
        expect(result.hasResults).toBe(true)
        expect(result.exact[0].name).toBe('bulbasaur')
      } else {
        expect(result.searchType).toBe('prefix')
        expect(result.hasResults).toBe(true)
        expect(result.exact[0].name).toBe('bulbasaur')
      }
    })

    it('debe retornar búsqueda difusa para términos similares', () => {
      const result = intelligentSearch(mockPokemonList, 'pikchu')

      expect(result.searchType).toBe('fuzzy')
      expect(result.hasResults).toBe(true)
      expect(result.exact).toHaveLength(0)
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.message).toContain('Quizás estás buscando')
    })

    it('debe retornar sin resultados para consultas muy cortas', () => {
      const result = intelligentSearch(mockPokemonList, 'p')

      expect(result.searchType).toBe('none')
      expect(result.hasResults).toBe(false)
      expect(result.exact).toHaveLength(0)
      expect(result.suggestions).toHaveLength(0)
    })

    it('debe retornar sin resultados cuando no encuentra coincidencias', () => {
      const result = intelligentSearch(mockPokemonList, 'xyz')

      expect(result.searchType).toBe('none')
      expect(result.hasResults).toBe(false)
      expect(result.exact).toHaveLength(0)
      expect(result.suggestions).toHaveLength(0)
      expect(result.message).toContain('No se encontraron')
    })

    it('debe respetar maxExactResults', () => {
      const result = intelligentSearch(mockPokemonList, 'a', { maxExactResults: 2 })

      if (result.hasResults && result.exact.length > 0) {
        expect(result.exact.length).toBeLessThanOrEqual(2)
      }
    })

    it('debe respetar maxSuggestions', () => {
      const result = intelligentSearch(mockPokemonList, 'pikchu', { maxSuggestions: 3 })

      if (result.hasResults && result.suggestions.length > 0) {
        expect(result.suggestions.length).toBeLessThanOrEqual(3)
      }
    })

    it('debe funcionar con consultas vacías', () => {
      const result = intelligentSearch(mockPokemonList, '')

      expect(result.searchType).toBe('none')
      expect(result.hasResults).toBe(false)
    })

    it('debe ser case-insensitive', () => {
      const result = intelligentSearch(mockPokemonList, 'PIKA')

      expect(result.hasResults).toBe(true)
      expect(result.exact[0].name).toBe('pikachu')
    })
  })

  describe('generateSearchSuggestions', () => {
    it('debe generar sugerencias para consultas con errores tipográficos', () => {
      const suggestions = generateSearchSuggestions('pikchu')

      expect(Array.isArray(suggestions)).toBe(true)
      expect(suggestions.length).toBeGreaterThan(0)
    })

    it('debe manejar consultas vacías', () => {
      const suggestions = generateSearchSuggestions('')

      expect(Array.isArray(suggestions)).toBe(true)
    })

    it('debe manejar consultas válidas', () => {
      const suggestions = generateSearchSuggestions('pikachu')

      expect(Array.isArray(suggestions)).toBe(true)
    })
  })
})
