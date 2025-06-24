import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePokemonStore } from '../pokemon'
import axios from 'axios'

// Mock de axios para las pruebas
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('Pokemon Store', () => {
  beforeEach(() => {
    // Inicializar Pinia antes de cada test
    setActivePinia(createPinia())
    // Limpiar mocks
    vi.clearAllMocks()
  })

  describe('Estado inicial', () => {
    it('debe tener el estado inicial correcto', () => {
      const store = usePokemonStore()

      expect(store.allPokemons).toEqual([])
      expect(store.pokemonDetails).toBeInstanceOf(Map)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('Getters', () => {
    it('hasPokemonList debe retornar false cuando no hay pokemon', () => {
      const store = usePokemonStore()

      expect(store.hasPokemonList).toBe(false)
    })

    it('hasPokemonList debe retornar true cuando hay pokemon', () => {
      const store = usePokemonStore()
      store.allPokemons = [{ name: 'pikachu', url: 'test-url' }]

      expect(store.hasPokemonList).toBe(true)
    })

    it('getPokemonByName debe retornar null si no existe', () => {
      const store = usePokemonStore()

      expect(store.getPokemonByName('pikachu')).toBe(null)
    })

    it('getPokemonByName debe retornar el pokemon si existe en cache', () => {
      const store = usePokemonStore()
      const mockPokemon = { name: 'pikachu', id: 25 }

      store.pokemonDetails.set('pikachu', mockPokemon)

      expect(store.getPokemonByName('pikachu')).toEqual(mockPokemon)
    })
  })

  describe('fetchAllPokemons', () => {
    it('debe cargar pokemon exitosamente', async () => {
      const store = usePokemonStore()
      const mockResponse = {
        data: {
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
          ],
        },
      }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      await store.fetchAllPokemons()

      expect(store.allPokemons).toEqual(mockResponse.data.results)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=151')
    })

    it('debe manejar errores correctamente', async () => {
      const store = usePokemonStore()
      const mockError = new Error('Network error')

      mockedAxios.get.mockRejectedValueOnce(mockError)

      await store.fetchAllPokemons()

      expect(store.allPokemons).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Error al cargar la lista de Pokemon')
    })

    it('debe usar el limite personalizado', async () => {
      const store = usePokemonStore()
      const mockResponse = { data: { results: [] } }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      await store.fetchAllPokemons(50)

      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=50')
    })
  })

  describe('fetchPokemonDetails', () => {
    it('debe obtener detalles de pokemon por nombre', async () => {
      const store = usePokemonStore()
      const mockPokemon = {
        name: 'pikachu',
        id: 25,
        types: [{ type: { name: 'electric' } }],
        abilities: [{ ability: { name: 'static' } }],
      }
      const mockResponse = { data: mockPokemon }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await store.fetchPokemonDetails('pikachu')

      expect(result).toEqual(mockPokemon)
      expect(store.pokemonDetails.get('pikachu')).toEqual(mockPokemon)
      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu')
    })

    it('debe retornar datos desde cache si ya existen', async () => {
      const store = usePokemonStore()
      const mockPokemon = { name: 'pikachu', id: 25 }

      // Agregar al cache
      store.pokemonDetails.set('pikachu', mockPokemon)

      const result = await store.fetchPokemonDetails('pikachu')

      expect(result).toEqual(mockPokemon)
      expect(mockedAxios.get).not.toHaveBeenCalled()
    })

    it('debe manejar URLs correctamente', async () => {
      const store = usePokemonStore()
      const mockResponse = { data: { name: 'bulbasaur', id: 1 } }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      await store.fetchPokemonDetails('https://pokeapi.co/api/v2/pokemon/1/')

      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1/')
    })

    it('debe retornar null en caso de error', async () => {
      const store = usePokemonStore()
      const mockError = new Error('Pokemon not found')

      mockedAxios.get.mockRejectedValueOnce(mockError)

      const result = await store.fetchPokemonDetails('nonexistent')

      expect(result).toBe(null)
    })
  })

  describe('Métodos de utilidad', () => {
    it('clearPokemonCache debe limpiar el cache', () => {
      const store = usePokemonStore()

      store.pokemonDetails.set('pikachu', { name: 'pikachu' })
      expect(store.pokemonDetails.size).toBe(1)

      store.clearPokemonCache()
      expect(store.pokemonDetails.size).toBe(0)
    })

    it('resetStore debe reinicializar todo el estado', () => {
      const store = usePokemonStore()

      // Modificar el estado
      store.allPokemons = [{ name: 'test' }]
      store.pokemonDetails.set('test', { name: 'test' })
      store.isLoading = true
      store.error = 'Test error'

      store.resetStore()

      expect(store.allPokemons).toEqual([])
      expect(store.pokemonDetails.size).toBe(0)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
    })
  })
})
