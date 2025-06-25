import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'

export function useSearchPokemon() {
  const pokemonStore = usePokemonStore()
  const favoritesStore = useFavoritesStore()

  // Estado interno del composable
  const state = {
    searchQuery: '',
    searchResults: [],
    isSearching: false,
    searchError: null,
  }

  // Función para filtrar Pokémon por nombre
  const getFilteredPokemons = (query) => {
    if (!query || query.length < 2) {
      return []
    }

    const searchTerm = query.toLowerCase().trim()
    console.log('🔎 Buscando:', searchTerm)
    console.log('📝 Pokemon disponibles:', pokemonStore.allPokemons.length)

    // Debug: mostrar los primeros 5 pokemon para verificar estructura
    if (pokemonStore.allPokemons.length > 0) {
      console.log(
        '🔍 Primeros Pokemon:',
        pokemonStore.allPokemons.slice(0, 5).map((p) => p.name),
      )
    }

    const filtered = pokemonStore.allPokemons
      .filter((pokemon) => {
        const pokemonName = pokemon.name.toLowerCase()
        const matches = pokemonName.includes(searchTerm)
        if (matches) {
          console.log('✅ Encontrado:', pokemon.name)
        }
        return matches
      })
      .slice(0, 10) // Limitar a 10 resultados para performance

    console.log('🎯 Resultados filtrados:', filtered.length)
    return filtered
  }

  // Función para obtener detalles de los Pokémon filtrados
  const fetchPokemonDetails = async (pokemons) => {
    console.log('🔍 Obteniendo detalles para:', pokemons.length, 'pokemon')

    if (!pokemons.length) {
      console.log('❌ No hay pokemon para obtener detalles')
      state.searchResults = []
      state.isSearching = false
      return
    }

    state.isSearching = true
    state.searchError = null

    try {
      const detailPromises = pokemons.map(async (pokemon) => {
        try {
          console.log('📡 Obteniendo detalles de:', pokemon.name)
          const details = await pokemonStore.fetchPokemonDetails(pokemon.url || pokemon.name)
          return details
            ? {
                ...pokemon,
                id: details.id,
                sprites: details.sprites,
                types: details.types,
                height: details.height,
                weight: details.weight,
              }
            : pokemon
        } catch (error) {
          console.warn(`Error fetching details for ${pokemon.name}:`, error)
          return pokemon
        }
      })

      const results = await Promise.all(detailPromises)
      const filteredResults = results.filter(Boolean)
      console.log('✅ Detalles obtenidos, resultados finales:', filteredResults.length)
      state.searchResults = filteredResults
    } catch (error) {
      console.error('Error fetching pokemon details:', error)
      state.searchError = 'Error al obtener detalles de los Pokémon'
      state.searchResults = []
    } finally {
      state.isSearching = false
    }
  }

  // Función para realizar búsqueda
  const performSearch = async (query) => {
    console.log('🚀 Iniciando búsqueda para:', query)
    state.searchQuery = query

    if (!query || query.length < 2) {
      state.searchResults = []
      return
    }

    // Asegurar que tenemos la lista de Pokémon
    if (!pokemonStore.hasPokemonList) {
      console.log('📦 Cargando lista de Pokemon...')
      state.isSearching = true
      try {
        await pokemonStore.fetchAllPokemons()
        console.log('✅ Lista cargada, total Pokemon:', pokemonStore.allPokemons.length)
      } catch (error) {
        console.error('❌ Error cargando Pokemon:', error)
        state.searchError = 'Error al cargar la lista de Pokémon'
        state.isSearching = false
        return
      }
    }

    // Obtener detalles de Pokémon filtrados
    const filteredPokemons = getFilteredPokemons(query)
    console.log('🎪 Pokemon filtrados para detalles:', filteredPokemons)
    await fetchPokemonDetails(filteredPokemons)
  }

  // Función para limpiar búsqueda
  const clearSearch = () => {
    state.searchQuery = ''
    state.searchResults = []
    state.searchError = null
    state.isSearching = false
  }

  // Función para alternar favorito
  const toggleFavorite = async (pokemon) => {
    try {
      await favoritesStore.toggleFavorite(pokemon.name)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  // Función para verificar si es favorito
  const isFavorite = (pokemonName) => {
    return favoritesStore.isPokemonFavorite(pokemonName)
  }

  return {
    // State getters
    get searchQuery() {
      return state.searchQuery
    },
    get searchResults() {
      return state.searchResults
    },
    get isSearching() {
      return state.isSearching
    },
    get searchError() {
      return state.searchError
    },
    get isProcessingFavorite() {
      return favoritesStore.isProcessingFavorite
    },

    // Methods
    performSearch,
    clearSearch,
    toggleFavorite,
    isFavorite,

    // Store getters
    get allPokemons() {
      return pokemonStore.allPokemons
    },
    get isLoadingPokemons() {
      return pokemonStore.isLoading
    },
  }
}
