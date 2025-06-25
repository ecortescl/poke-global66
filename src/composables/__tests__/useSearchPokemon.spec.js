import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSearchPokemon } from '../useSearchPokemon'

// Mock de los stores
vi.mock('@/stores/pokemon', () => ({
  usePokemonStore: vi.fn(() => ({
    allPokemons: [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    ],
    hasPokemonList: true,
    isLoading: false,
    fetchAllPokemons: vi.fn(),
    fetchPokemonDetails: vi.fn((name) =>
      Promise.resolve({
        name,
        id: 1,
        sprites: { front_default: 'image.png' },
        types: [{ type: { name: 'electric' } }],
        height: 4,
        weight: 60,
      }),
    ),
  })),
}))

vi.mock('@/stores/favorites', () => ({
  useFavoritesStore: vi.fn(() => ({
    isProcessingFavorite: false,
    toggleFavorite: vi.fn(),
    isPokemonFavorite: vi.fn(() => false),
  })),
}))

describe('useSearchPokemon', () => {
  let searchLogic

  beforeEach(() => {
    searchLogic = useSearchPokemon()
  })

  it('should initialize with empty state', () => {
    expect(searchLogic.searchQuery).toBe('')
    expect(searchLogic.searchResults).toEqual([])
    expect(searchLogic.isSearching).toBe(false)
    expect(searchLogic.searchError).toBe(null)
  })

  it('should not search for queries less than 2 characters', async () => {
    await searchLogic.performSearch('p')

    expect(searchLogic.searchResults).toEqual([])
    expect(searchLogic.isSearching).toBe(false)
  })

  it('should filter pokemon by name', async () => {
    await searchLogic.performSearch('pika')

    expect(searchLogic.searchQuery).toBe('pika')
    expect(searchLogic.searchResults.length).toBeGreaterThan(0)
  })

  it('should clear search results', () => {
    searchLogic.clearSearch()

    expect(searchLogic.searchQuery).toBe('')
    expect(searchLogic.searchResults).toEqual([])
    expect(searchLogic.searchError).toBe(null)
    expect(searchLogic.isSearching).toBe(false)
  })

  it('should check if pokemon is favorite', () => {
    const isFavorite = searchLogic.isFavorite('pikachu')

    expect(typeof isFavorite).toBe('boolean')
  })

  it('should toggle pokemon favorite status', async () => {
    const pokemon = { name: 'pikachu' }

    await expect(searchLogic.toggleFavorite(pokemon)).resolves.not.toThrow()
  })
})
