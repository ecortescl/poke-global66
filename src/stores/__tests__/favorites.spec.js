import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoritesStore } from '../favorites'
import { usePokemonStore } from '../pokemon'

// Mock del pokemon store
vi.mock('../pokemon', () => ({
  usePokemonStore: vi.fn(() => ({
    fetchPokemonDetails: vi.fn(),
  })),
}))

describe('Favorites Store', () => {
  let favoritesStore
  let mockPokemonStore

  beforeEach(() => {
    // Inicializar Pinia antes de cada test
    setActivePinia(createPinia())

    // Configurar mocks
    mockPokemonStore = {
      fetchPokemonDetails: vi.fn(),
    }
    vi.mocked(usePokemonStore).mockReturnValue(mockPokemonStore)

    favoritesStore = useFavoritesStore()

    // Limpiar mocks
    vi.clearAllMocks()
  })

  describe('Estado inicial', () => {
    it('debe tener el estado inicial correcto', () => {
      expect(favoritesStore.favoritePokemons).toEqual([])
      expect(favoritesStore.isProcessingFavorite).toBe(false)
    })
  })

  describe('Getters', () => {
    beforeEach(() => {
      // Agregar algunos pokemon favoritos para los tests
      favoritesStore.favoritePokemons = [
        { name: 'pikachu', id: 25 },
        { name: 'charizard', id: 6 },
        { name: 'blastoise', id: 9 },
      ]
    })

    it('favoritesCount debe retornar la cantidad correcta', () => {
      expect(favoritesStore.favoritesCount).toBe(3)
    })

    it('isPokemonFavorite debe retornar true para pokemon favorito', () => {
      expect(favoritesStore.isPokemonFavorite('pikachu')).toBe(true)
      expect(favoritesStore.isPokemonFavorite('PIKACHU')).toBe(true) // Case insensitive
    })

    it('isPokemonFavorite debe retornar false para pokemon no favorito', () => {
      expect(favoritesStore.isPokemonFavorite('mew')).toBe(false)
    })

    it('getFavoritePokemon debe retornar el pokemon correcto', () => {
      const pokemon = favoritesStore.getFavoritePokemon('charizard')
      expect(pokemon).toEqual({ name: 'charizard', id: 6 })
    })

    it('getFavoritePokemon debe retornar undefined para pokemon no favorito', () => {
      const pokemon = favoritesStore.getFavoritePokemon('mew')
      expect(pokemon).toBeUndefined()
    })
  })

  describe('toggleFavorite', () => {
    it('debe agregar pokemon a favoritos cuando no existe', async () => {
      const mockPokemon = {
        name: 'pikachu',
        id: 25,
        types: [{ type: { name: 'electric' } }],
        abilities: [{ ability: { name: 'static' } }],
      }

      mockPokemonStore.fetchPokemonDetails.mockResolvedValueOnce(mockPokemon)

      await favoritesStore.toggleFavorite('pikachu')

      expect(favoritesStore.favoritePokemons).toHaveLength(1)
      expect(favoritesStore.favoritePokemons[0]).toEqual(mockPokemon)
      expect(favoritesStore.isProcessingFavorite).toBe(false)
    })

    it('debe remover pokemon de favoritos cuando ya existe', async () => {
      // Agregar pokemon a favoritos primero
      favoritesStore.favoritePokemons = [{ name: 'pikachu', id: 25 }]

      await favoritesStore.toggleFavorite('pikachu')

      expect(favoritesStore.favoritePokemons).toHaveLength(0)
      expect(mockPokemonStore.fetchPokemonDetails).not.toHaveBeenCalled()
    })

    it('debe manejar errores al obtener detalles del pokemon', async () => {
      mockPokemonStore.fetchPokemonDetails.mockResolvedValueOnce(null)

      await favoritesStore.toggleFavorite('nonexistent')

      expect(favoritesStore.favoritePokemons).toHaveLength(0)
      expect(favoritesStore.isProcessingFavorite).toBe(false)
    })

    it('debe manejar excepciones correctamente', async () => {
      mockPokemonStore.fetchPokemonDetails.mockRejectedValueOnce(new Error('Network error'))

      await favoritesStore.toggleFavorite('pikachu')

      expect(favoritesStore.favoritePokemons).toHaveLength(0)
      expect(favoritesStore.isProcessingFavorite).toBe(false)
    })

    it('debe funcionar con objetos pokemon', async () => {
      const pokemonObject = { name: 'charizard' }
      const mockPokemon = {
        name: 'charizard',
        id: 6,
        types: [{ type: { name: 'fire' } }],
      }

      mockPokemonStore.fetchPokemonDetails.mockResolvedValueOnce(mockPokemon)

      await favoritesStore.toggleFavorite(pokemonObject)

      expect(favoritesStore.favoritePokemons).toHaveLength(1)
      expect(favoritesStore.favoritePokemons[0]).toEqual(mockPokemon)
    })
  })

  describe('addFavorite', () => {
    it('debe agregar pokemon que no existe en favoritos', () => {
      const pokemon = { name: 'pikachu', id: 25 }

      favoritesStore.addFavorite(pokemon)

      expect(favoritesStore.favoritePokemons).toHaveLength(1)
      expect(favoritesStore.favoritePokemons[0]).toEqual(pokemon)
    })

    it('no debe agregar pokemon duplicado', () => {
      const pokemon = { name: 'pikachu', id: 25 }

      favoritesStore.favoritePokemons = [pokemon]
      favoritesStore.addFavorite(pokemon)

      expect(favoritesStore.favoritePokemons).toHaveLength(1)
    })
  })

  describe('removeFavorite', () => {
    it('debe remover pokemon de favoritos', () => {
      favoritesStore.favoritePokemons = [
        { name: 'pikachu', id: 25 },
        { name: 'charizard', id: 6 },
      ]

      favoritesStore.removeFavorite('pikachu')

      expect(favoritesStore.favoritePokemons).toHaveLength(1)
      expect(favoritesStore.favoritePokemons[0].name).toBe('charizard')
    })

    it('debe manejar nombres en mayúsculas', () => {
      favoritesStore.favoritePokemons = [{ name: 'pikachu', id: 25 }]

      favoritesStore.removeFavorite('PIKACHU')

      expect(favoritesStore.favoritePokemons).toHaveLength(0)
    })
  })

  describe('clearAllFavorites', () => {
    it('debe limpiar todos los favoritos', () => {
      favoritesStore.favoritePokemons = [
        { name: 'pikachu', id: 25 },
        { name: 'charizard', id: 6 },
      ]

      favoritesStore.clearAllFavorites()

      expect(favoritesStore.favoritePokemons).toHaveLength(0)
    })
  })

  describe('generateShareInfo', () => {
    beforeEach(() => {
      const mockPokemon = {
        name: 'pikachu',
        id: 25,
        abilities: [{ ability: { name: 'static' } }, { ability: { name: 'lightning-rod' } }],
        types: [{ type: { name: 'electric' } }],
        height: 40,
        weight: 60,
      }

      favoritesStore.favoritePokemons = [mockPokemon]
    })

    it('debe generar información de compartir correcta', () => {
      const shareInfo = favoritesStore.generateShareInfo('pikachu')

      expect(shareInfo).toBeDefined()
      expect(shareInfo.name).toBe('pikachu')
      expect(shareInfo.abilities).toBe('static, lightning-rod')
      expect(shareInfo.types).toBe('electric')
      expect(shareInfo.height).toBe(40)
      expect(shareInfo.weight).toBe(60)
      expect(shareInfo.shareText).toContain('Pikachu')
      expect(shareInfo.shareText).toContain('electric')
      expect(shareInfo.shareText).toContain('4m')
      expect(shareInfo.shareText).toContain('6kg')
    })

    it('debe retornar null para pokemon no favorito', () => {
      const shareInfo = favoritesStore.generateShareInfo('charizard')

      expect(shareInfo).toBe(null)
    })

    it('debe manejar pokemon sin habilidades o tipos', () => {
      const pokemonWithoutData = {
        name: 'missingno',
        id: 0,
        height: 10,
        weight: 10,
      }

      favoritesStore.favoritePokemons = [pokemonWithoutData]

      const shareInfo = favoritesStore.generateShareInfo('missingno')

      expect(shareInfo.abilities).toBe('Sin habilidades')
      expect(shareInfo.types).toBe('Sin tipos')
    })
  })
})
