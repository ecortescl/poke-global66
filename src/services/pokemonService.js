/**
 * Servicio para manejar todas las operaciones relacionadas con la API de Pokémon
 * Principio SOLID: Single Responsibility - Solo se encarga de las llamadas HTTP
 */

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2'
const POKEMON_LIMIT = 151 // Solo Pokémon de la primera generación

class PokemonService {
  /**
   * Obtiene la lista básica de Pokémon con paginación
   * @param {number} offset - Número de Pokémon a saltar
   * @param {number} limit - Número de Pokémon a obtener
   * @returns {Promise<Object>} Lista de Pokémon básica
   */
  async getPokemonList(offset = 0, limit = 20) {
    try {
      const response = await fetch(`${POKEMON_API_BASE}/pokemon?offset=${offset}&limit=${limit}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching Pokemon list:', error)
      throw new Error('Failed to fetch Pokemon list')
    }
  }

  /**
   * Obtiene los detalles completos de un Pokémon
   * @param {string} nameOrId - Nombre o ID del Pokémon
   * @returns {Promise<Object>} Detalles completos del Pokémon
   */
  async getPokemonDetails(nameOrId) {
    try {
      const response = await fetch(`${POKEMON_API_BASE}/pokemon/${nameOrId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching Pokemon details for ${nameOrId}:`, error)
      throw new Error(`Failed to fetch Pokemon details for ${nameOrId}`)
    }
  }

  /**
   * Obtiene múltiples Pokémon con sus detalles
   * @param {Array<Object>} pokemonList - Lista básica de Pokémon
   * @returns {Promise<Array<Object>>} Lista de Pokémon con detalles
   */
  async getPokemonWithDetails(pokemonList) {
    try {
      const detailPromises = pokemonList.map((pokemon) => this.getPokemonDetails(pokemon.name))

      return await Promise.all(detailPromises)
    } catch (error) {
      console.error('Error fetching Pokemon details:', error)
      throw new Error('Failed to fetch Pokemon details')
    }
  }

  /**
   * Busca Pokémon por nombre (filtrado local)
   * @param {Array<Object>} pokemonList - Lista completa de Pokémon
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Array<Object>} Pokémon filtrados
   */
  searchPokemon(pokemonList, searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
      return []
    }

    const normalizedSearch = searchTerm.toLowerCase().trim()

    return pokemonList.filter((pokemon) => pokemon.name.toLowerCase().includes(normalizedSearch))
  }

  /**
   * Obtiene el total de Pokémon disponibles (limitado a Gen 1)
   * @returns {number} Total de Pokémon
   */
  getTotalPokemonCount() {
    return POKEMON_LIMIT
  }
}

// Exportar una instancia singleton
export const pokemonService = new PokemonService()
export default pokemonService
