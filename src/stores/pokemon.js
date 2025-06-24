import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    allPokemons: [],
    pokemonDetails: new Map(), // Cache para detalles de Pokemon ya consultados
    isLoading: false,
    error: null,
  }),

  getters: {
    // Getter para obtener Pokemon por nombre desde el cache
    getPokemonByName: (state) => (name) => {
      return state.pokemonDetails.get(name) || null
    },

    // Getter para verificar si hay Pokemon cargados
    hasPokemonList: (state) => {
      return state.allPokemons.length > 0
    },
  },

  actions: {
    // Acción para obtener la lista inicial de Pokemon
    async fetchAllPokemons(limit = 151) {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
        this.allPokemons = response.data.results
        console.log(`✅ ${this.allPokemons.length} Pokemon cargados exitosamente`)
      } catch (error) {
        this.error = 'Error al cargar la lista de Pokemon'
        console.error('❌ Error fetching all pokemons:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Acción para obtener detalles específicos de un Pokemon
    async fetchPokemonDetails(nameOrUrl) {
      try {
        // Si ya tenemos los detalles en cache, los devolvemos
        const pokemonName =
          typeof nameOrUrl === 'string' ? nameOrUrl : nameOrUrl.split('/').slice(-2)[0]

        if (this.pokemonDetails.has(pokemonName)) {
          return this.pokemonDetails.get(pokemonName)
        }

        // Construir la URL correcta
        const url = nameOrUrl.includes('http')
          ? nameOrUrl
          : `https://pokeapi.co/api/v2/pokemon/${nameOrUrl}`

        const response = await axios.get(url)
        const pokemonData = response.data

        // Guardamos en cache para futuras consultas
        this.pokemonDetails.set(pokemonName, pokemonData)

        return pokemonData
      } catch (error) {
        console.error(`❌ Error fetching details for ${nameOrUrl}:`, error)
        return null
      }
    },

    // Acción para limpiar el cache de detalles
    clearPokemonCache() {
      this.pokemonDetails.clear()
    },

    // Acción para reinicializar el estado
    resetStore() {
      this.allPokemons = []
      this.pokemonDetails.clear()
      this.isLoading = false
      this.error = null
    },
  },
})
