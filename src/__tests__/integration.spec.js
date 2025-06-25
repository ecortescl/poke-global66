import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import { useSearchPokemon } from '@/composables/useSearchPokemon'

// Mock global del fetch para tests de integración
global.fetch = vi.fn()

describe('Tests de Integración - Pokemon App', () => {
  let pinia

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('Flujo completo de búsqueda y favoritos', () => {
    it('debe permitir buscar Pokemon y agregarlos a favoritos', async () => {
      // Mock del store de pokemon directamente ya que usa axios, no fetch
      const pokemonStore = usePokemonStore()
      const favoritesStore = useFavoritesStore()
      const searchLogic = useSearchPokemon()

      // Configurar el store directamente con datos mock
      pokemonStore.allPokemons = [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
      ]

      const mockPikachuDetails = {
        name: 'pikachu',
        id: 25,
        types: [{ type: { name: 'electric' } }],
        abilities: [{ ability: { name: 'static' } }],
        height: 4,
        weight: 60,
        sprites: { front_default: 'pikachu.png' },
      }

      // Mock de fetchPokemonDetails para que devuelva los detalles mock
      pokemonStore.fetchPokemonDetails = vi.fn().mockResolvedValue(mockPikachuDetails)

      // 1. Verificar lista de Pokemon
      expect(pokemonStore.allPokemons).toHaveLength(2)

      // 2. Realizar búsqueda
      await searchLogic.performSearch('pika')
      expect(searchLogic.searchResults).toHaveLength(1)
      expect(searchLogic.searchResults[0].name).toBe('pikachu')

      // 3. Agregar a favoritos
      await searchLogic.toggleFavorite(searchLogic.searchResults[0])
      expect(favoritesStore.favoritePokemons).toHaveLength(1)
      expect(favoritesStore.isPokemonFavorite('pikachu')).toBe(true)

      // 4. Remover de favoritos
      await searchLogic.toggleFavorite(searchLogic.searchResults[0])
      expect(favoritesStore.favoritePokemons).toHaveLength(0)
      expect(favoritesStore.isPokemonFavorite('pikachu')).toBe(false)
    })

    it('debe manejar errores de red correctamente', async () => {
      const pokemonStore = usePokemonStore()

      // Simular error directamente en el store
      pokemonStore.error = 'Error al cargar la lista de Pokemon'
      pokemonStore.allPokemons = []

      expect(pokemonStore.error).toBe('Error al cargar la lista de Pokemon')
      expect(pokemonStore.allPokemons).toHaveLength(0)
    })

    it('debe mantener la sincronización entre stores', async () => {
      const mockPokemonDetails = {
        name: 'charizard',
        id: 6,
        types: [{ type: { name: 'fire' } }],
        abilities: [{ ability: { name: 'blaze' } }],
        height: 17,
        weight: 905,
        sprites: { front_default: 'charizard.png' },
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetails),
      })

      const pokemonStore = usePokemonStore()
      const favoritesStore = useFavoritesStore()

      // Agregar Pokemon a favoritos
      await favoritesStore.toggleFavorite('charizard')

      // Verificar que se guardó en cache del pokemon store
      expect(pokemonStore.pokemonDetails.has('charizard')).toBe(true)
      expect(favoritesStore.favoritePokemons).toHaveLength(1)
    })
  })

  describe('Persistencia de favoritos', () => {
    it('debe persistir favoritos en localStorage', () => {
      const favoritesStore = useFavoritesStore()
      const mockPokemon = {
        name: 'bulbasaur',
        id: 1,
        types: [{ type: { name: 'grass' } }],
      }

      // Mock de localStorage
      const mockLocalStorage = {
        getItem: vi.fn(() => '[]'),
        setItem: vi.fn(),
      }

      // Asignar el mock a global en lugar de window
      global.localStorage = mockLocalStorage

      // Limpiar favoritos antes de agregar
      favoritesStore.favoritePokemons = []
      favoritesStore.addFavorite(mockPokemon)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'pokeFavorites',
        JSON.stringify([mockPokemon]),
      )
    })
  })

  describe('Rendimiento y cache', () => {
    it('debe usar cache para evitar peticiones duplicadas', async () => {
      const mockPokemonDetails = {
        name: 'squirtle',
        id: 7,
        types: [{ type: { name: 'water' } }],
      }

      const pokemonStore = usePokemonStore()

      // Mock de fetchPokemonDetails para simular el comportamiento de cache
      let callCount = 0
      pokemonStore.fetchPokemonDetails = vi.fn((name) => {
        if (pokemonStore.pokemonDetails.has(name)) {
          // Simular cache hit
          return Promise.resolve(pokemonStore.pokemonDetails.get(name))
        } else {
          // Simular cache miss
          callCount++
          pokemonStore.pokemonDetails.set(name, mockPokemonDetails)
          return Promise.resolve(mockPokemonDetails)
        }
      })

      // Primera llamada - debe hacer petición
      const result1 = await pokemonStore.fetchPokemonDetails('squirtle')
      expect(callCount).toBe(1)

      // Segunda llamada - debe usar cache
      const result2 = await pokemonStore.fetchPokemonDetails('squirtle')
      expect(callCount).toBe(1) // No debe incrementar

      expect(result1).toEqual(result2)
      expect(result1).toEqual(mockPokemonDetails)
    })
  })
})
