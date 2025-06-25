import { describe, it, expect, vi, beforeEach } from 'vitest'
import { pokemonService } from '../pokemonService'

// Mock global del fetch
global.fetch = vi.fn()

describe('Pokemon Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPokemonList', () => {
    it('debe obtener la lista de Pokemon exitosamente', async () => {
      const mockResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await pokemonService.getPokemonList(0, 20)

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20')
      expect(result).toEqual(mockResponse)
    })

    it('debe manejar errores de red', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(pokemonService.getPokemonList()).rejects.toThrow('Failed to fetch Pokemon list')
    })

    it('debe usar valores por defecto para offset y limit', async () => {
      const mockResponse = { results: [] }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      await pokemonService.getPokemonList()

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20')
    })
  })

  describe('getPokemonDetails', () => {
    it('debe obtener detalles de Pokemon por nombre', async () => {
      const mockPokemon = {
        name: 'pikachu',
        id: 25,
        types: [{ type: { name: 'electric' } }],
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      })

      const result = await pokemonService.getPokemonDetails('pikachu')

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu')
      expect(result).toEqual(mockPokemon)
    })

    it('debe obtener detalles de Pokemon por ID', async () => {
      const mockPokemon = { name: 'pikachu', id: 25 }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      })

      await pokemonService.getPokemonDetails(25)

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25')
    })

    it('debe manejar Pokemon no encontrado', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(pokemonService.getPokemonDetails('nonexistent')).rejects.toThrow(
        'Failed to fetch Pokemon details for nonexistent',
      )
    })
  })

  describe('getPokemonWithDetails', () => {
    it('debe obtener múltiples Pokemon con detalles', async () => {
      const mockPokemonList = [{ name: 'pikachu' }, { name: 'charizard' }]

      const mockPikachu = { name: 'pikachu', id: 25 }
      const mockCharizard = { name: 'charizard', id: 6 }

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPikachu),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCharizard),
        })

      const result = await pokemonService.getPokemonWithDetails(mockPokemonList)

      expect(result).toEqual([mockPikachu, mockCharizard])
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('debe manejar errores al obtener detalles múltiples', async () => {
      const mockPokemonList = [{ name: 'invalid' }]

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(pokemonService.getPokemonWithDetails(mockPokemonList)).rejects.toThrow(
        'Failed to fetch Pokemon details',
      )
    })
  })

  describe('searchPokemon', () => {
    const mockPokemonList = [
      { name: 'pikachu' },
      { name: 'charizard' },
      { name: 'charmander' },
      { name: 'bulbasaur' },
    ]

    it('debe filtrar Pokemon por nombre', () => {
      const result = pokemonService.searchPokemon(mockPokemonList, 'char')

      expect(result).toHaveLength(2)
      expect(result.map((p) => p.name)).toContain('charizard')
      expect(result.map((p) => p.name)).toContain('charmander')
    })

    it('debe ser case-insensitive', () => {
      const result = pokemonService.searchPokemon(mockPokemonList, 'PIKA')

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('pikachu')
    })

    it('debe retornar array vacío para búsquedas cortas', () => {
      const result = pokemonService.searchPokemon(mockPokemonList, 'p')

      expect(result).toEqual([])
    })

    it('debe manejar términos de búsqueda vacíos', () => {
      const result = pokemonService.searchPokemon(mockPokemonList, '')

      expect(result).toEqual([])
    })

    it('debe trimear espacios en blanco', () => {
      const result = pokemonService.searchPokemon(mockPokemonList, '  char  ')

      expect(result).toHaveLength(2)
    })
  })

  describe('getTotalPokemonCount', () => {
    it('debe retornar el límite de Pokemon (151)', () => {
      const result = pokemonService.getTotalPokemonCount()

      expect(result).toBe(151)
    })
  })
})
