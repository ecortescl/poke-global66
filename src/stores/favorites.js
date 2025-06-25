import { defineStore } from 'pinia'
import { usePokemonStore } from './pokemon'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoritePokemons: JSON.parse(localStorage.getItem('pokeFavorites') || '[]'), // Array de objetos Pokemon completos
    isProcessingFavorite: false,
  }),

  getters: {
    // Getter para verificar si un Pokemon está en favoritos
    isPokemonFavorite: (state) => (pokemonName) => {
      return state.favoritePokemons.some((pokemon) => pokemon.name === pokemonName.toLowerCase())
    },

    // Getter para obtener la cantidad de favoritos
    favoritesCount: (state) => {
      return state.favoritePokemons.length
    },

    // Getter para obtener Pokemon favorito por nombre
    getFavoritePokemon: (state) => (pokemonName) => {
      return state.favoritePokemons.find((pokemon) => pokemon.name === pokemonName.toLowerCase())
    },
  },

  actions: {
    // Acción para alternar un Pokemon entre favoritos
    async toggleFavorite(pokemonNameOrUrl) {
      this.isProcessingFavorite = true

      try {
        const pokemonStore = usePokemonStore()
        const pokemonName =
          typeof pokemonNameOrUrl === 'string'
            ? pokemonNameOrUrl.toLowerCase()
            : pokemonNameOrUrl.name.toLowerCase()

        if (this.isPokemonFavorite(pokemonName)) {
          // Remover de favoritos
          this.removeFavorite(pokemonName)
          console.log(`💔 ${pokemonName} removido de favoritos`)
        } else {
          // Obtener detalles completos del Pokemon antes de agregarlo a favoritos
          const pokemonDetails = await pokemonStore.fetchPokemonDetails(pokemonNameOrUrl)

          if (pokemonDetails) {
            this.addFavorite(pokemonDetails)
            console.log(`❤️ ${pokemonName} agregado a favoritos`)
          } else {
            console.error(`❌ No se pudieron obtener detalles de ${pokemonName}`)
          }
        }
      } catch (error) {
        console.error('❌ Error al procesar favorito:', error)
      } finally {
        this.isProcessingFavorite = false
      }
    },

    // Acción privada para agregar a favoritos
    addFavorite(pokemonDetails) {
      // Verificar que no esté ya en favoritos para evitar duplicados
      if (!this.isPokemonFavorite(pokemonDetails.name)) {
        this.favoritePokemons.push(pokemonDetails)
        this.saveFavoritesToStorage()
      }
    },

    // Acción privada para remover de favoritos
    removeFavorite(pokemonName) {
      this.favoritePokemons = this.favoritePokemons.filter(
        (pokemon) => pokemon.name !== pokemonName.toLowerCase(),
      )
      this.saveFavoritesToStorage()
    },

    // Acción para limpiar todos los favoritos
    clearAllFavorites() {
      this.favoritePokemons = []
      this.saveFavoritesToStorage()
      console.log('🗑️ Todos los favoritos han sido eliminados')
    },

    // Acción para guardar favoritos en localStorage
    saveFavoritesToStorage() {
      localStorage.setItem('pokeFavorites', JSON.stringify(this.favoritePokemons))
    },

    // Acción para obtener información de compartir de un Pokemon favorito
    generateShareInfo(pokemonName) {
      const pokemon = this.getFavoritePokemon(pokemonName)

      if (pokemon) {
        const abilities =
          pokemon.abilities?.map((a) => a.ability.name).join(', ') || 'Sin habilidades'
        const types = pokemon.types?.map((t) => t.type.name).join(', ') || 'Sin tipos'

        return {
          name: pokemon.name,
          abilities,
          types,
          height: pokemon.height,
          weight: pokemon.weight,
          shareText: `🔥 ¡Mira este increíble Pokémon! 
📛 Nombre: ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
🎯 Tipos: ${types}
⚡ Habilidades: ${abilities}
📏 Altura: ${pokemon.height / 10}m
⚖️ Peso: ${pokemon.weight / 10}kg
#Pokemon #PokeGlobal66`,
        }
      }

      return null
    },
  },
})
