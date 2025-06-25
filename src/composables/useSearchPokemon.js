import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import { intelligentSearch, generateSearchSuggestions } from '@/utils/fuzzySearch'

export function useSearchPokemon() {
  const pokemonStore = usePokemonStore()
  const favoritesStore = useFavoritesStore()

  // Estado interno del composable
  const state = {
    searchQuery: '',
    searchResults: [],
    suggestions: [],
    isSearching: false,
    searchError: null,
    searchType: 'none',
    searchMessage: '',
  }

  // Función para obtener detalles de los Pokémon
  const fetchPokemonDetails = async (pokemons) => {
    if (!pokemons.length) {
      return []
    }

    try {
      const detailPromises = pokemons.map(async (pokemon) => {
        try {
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
      return results.filter(Boolean)
    } catch (error) {
      console.error('Error fetching pokemon details:', error)
      throw error
    }
  }

  // Función principal de búsqueda inteligente
  const performSearch = async (query) => {
    console.log('🚀 Búsqueda inteligente para:', query)
    state.searchQuery = query

    // Limpiar estado anterior
    state.searchResults = []
    state.suggestions = []
    state.searchError = null
    state.searchMessage = ''
    state.searchType = 'none'

    if (!query || query.length < 2) {
      return
    }

    state.isSearching = true

    try {
      // Asegurar que tenemos la lista de Pokémon
      if (!pokemonStore.hasPokemonList) {
        console.log('📦 Cargando lista de Pokemon...')
        await pokemonStore.fetchAllPokemons()
      }

      // Realizar búsqueda inteligente
      const searchResult = intelligentSearch(pokemonStore.allPokemons, query, {
        maxExactResults: 10,
        maxSuggestions: 5,
        similarityThreshold: 0.4,
        minQueryLength: 2,
      })

      console.log('🎯 Resultado de búsqueda inteligente:', searchResult)

      state.searchType = searchResult.searchType
      state.searchMessage = searchResult.message || ''

      if (searchResult.hasResults) {
        // Procesar resultados exactos
        if (searchResult.exact.length > 0) {
          console.log('✅ Resultados exactos:', searchResult.exact.length)
          const detailedResults = await fetchPokemonDetails(searchResult.exact)
          state.searchResults = detailedResults
        }

        // Procesar sugerencias
        if (searchResult.suggestions.length > 0) {
          console.log('💡 Sugerencias:', searchResult.suggestions.length)
          const detailedSuggestions = await fetchPokemonDetails(searchResult.suggestions)
          state.suggestions = detailedSuggestions
        }
      } else {
        // Sin resultados - generar sugerencias adicionales
        const textSuggestions = generateSearchSuggestions(query)
        if (textSuggestions.length > 0) {
          console.log('🔧 Sugerencias de corrección:', textSuggestions)

          // Buscar los Pokémon sugeridos
          const suggestedPokemons = pokemonStore.allPokemons.filter((pokemon) =>
            textSuggestions.some((suggestion) =>
              pokemon.name.toLowerCase().includes(suggestion.toLowerCase()),
            ),
          )

          if (suggestedPokemons.length > 0) {
            const detailedSuggestions = await fetchPokemonDetails(suggestedPokemons)
            state.suggestions = detailedSuggestions
            state.searchMessage = `¿Quizás quisiste decir alguno de estos?`
            state.searchType = 'correction'
          }
        }
      }
    } catch (error) {
      console.error('❌ Error en búsqueda:', error)
      state.searchError = 'Error al realizar la búsqueda'
    } finally {
      state.isSearching = false
    }
  }

  // Función para limpiar búsqueda
  const clearSearch = () => {
    state.searchQuery = ''
    state.searchResults = []
    state.suggestions = []
    state.searchError = null
    state.isSearching = false
    state.searchType = 'none'
    state.searchMessage = ''
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

  // Función para aplicar una sugerencia
  const applySuggestion = async (suggestedPokemon) => {
    console.log('✨ Aplicando sugerencia:', suggestedPokemon.name)
    await performSearch(suggestedPokemon.name)
  }

  return {
    // State getters
    get searchQuery() {
      return state.searchQuery
    },
    get searchResults() {
      return state.searchResults
    },
    get suggestions() {
      return state.suggestions
    },
    get isSearching() {
      return state.isSearching
    },
    get searchError() {
      return state.searchError
    },
    get searchType() {
      return state.searchType
    },
    get searchMessage() {
      return state.searchMessage
    },
    get isProcessingFavorite() {
      return favoritesStore.isProcessingFavorite
    },
    get hasResults() {
      return state.searchResults.length > 0 || state.suggestions.length > 0
    },

    // Methods
    performSearch,
    clearSearch,
    toggleFavorite,
    isFavorite,
    applySuggestion,

    // Store getters
    get allPokemons() {
      return pokemonStore.allPokemons
    },
    get isLoadingPokemons() {
      return pokemonStore.isLoading
    },
  }
}
