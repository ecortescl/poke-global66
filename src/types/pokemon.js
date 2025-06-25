/**
 * Definiciones de tipos para entidades Pokémon
 * Principio SOLID: Interface Segregation - Interfaces específicas para cada uso
 */

/**
 * Tipo básico de Pokémon (solo información esencial)
 * @typedef {Object} BasicPokemon
 * @property {string} name - Nombre del Pokémon
 * @property {string} url - URL para obtener detalles completos
 */

/**
 * Tipo completo de Pokémon con todos los detalles
 * @typedef {Object} DetailedPokemon
 * @property {number} id - ID único del Pokémon
 * @property {string} name - Nombre del Pokémon
 * @property {number} height - Altura en decímetros
 * @property {number} weight - Peso en hectogramos
 * @property {number} base_experience - Experiencia base
 * @property {PokemonSprites} sprites - Imágenes del Pokémon
 * @property {Array<PokemonType>} types - Tipos del Pokémon
 * @property {Array<PokemonAbility>} abilities - Habilidades del Pokémon
 * @property {Array<PokemonStat>} stats - Estadísticas del Pokémon
 */

/**
 * Sprites/imágenes del Pokémon
 * @typedef {Object} PokemonSprites
 * @property {string|null} front_default - Imagen frontal por defecto
 * @property {string|null} front_shiny - Imagen frontal shiny
 * @property {string|null} back_default - Imagen trasera por defecto
 * @property {string|null} back_shiny - Imagen trasera shiny
 */

/**
 * Tipo de Pokémon
 * @typedef {Object} PokemonType
 * @property {number} slot - Posición del tipo (1 o 2)
 * @property {TypeInfo} type - Información del tipo
 */

/**
 * Información de tipo
 * @typedef {Object} TypeInfo
 * @property {string} name - Nombre del tipo
 * @property {string} url - URL para detalles del tipo
 */

/**
 * Habilidad de Pokémon
 * @typedef {Object} PokemonAbility
 * @property {boolean} is_hidden - Si es una habilidad oculta
 * @property {number} slot - Posición de la habilidad
 * @property {AbilityInfo} ability - Información de la habilidad
 */

/**
 * Información de habilidad
 * @typedef {Object} AbilityInfo
 * @property {string} name - Nombre de la habilidad
 * @property {string} url - URL para detalles de la habilidad
 */

/**
 * Estadística de Pokémon
 * @typedef {Object} PokemonStat
 * @property {number} base_stat - Valor base de la estadística
 * @property {number} effort - Puntos de esfuerzo
 * @property {StatInfo} stat - Información de la estadística
 */

/**
 * Información de estadística
 * @typedef {Object} StatInfo
 * @property {string} name - Nombre de la estadística
 * @property {string} url - URL para detalles de la estadística
 */

/**
 * Respuesta de la API para lista de Pokémon
 * @typedef {Object} PokemonListResponse
 * @property {number} count - Total de Pokémon disponibles
 * @property {string|null} next - URL para la siguiente página
 * @property {string|null} previous - URL para la página anterior
 * @property {Array<BasicPokemon>} results - Lista de Pokémon básicos
 */

/**
 * Estado de búsqueda
 * @typedef {Object} SearchState
 * @property {string} query - Término de búsqueda actual
 * @property {Array<DetailedPokemon>} results - Resultados de búsqueda
 * @property {boolean} isSearching - Si está buscando actualmente
 * @property {string|null} error - Error de búsqueda si existe
 */

/**
 * Estado de favoritos
 * @typedef {Object} FavoritesState
 * @property {Array<string>} favoriteNames - Nombres de Pokémon favoritos
 * @property {Array<DetailedPokemon>} favoritePokemons - Pokémon favoritos completos
 * @property {boolean} isProcessing - Si está procesando cambios
 */

/**
 * Configuración de filtros
 * @typedef {Object} FilterConfig
 * @property {'all'|'favorites'} type - Tipo de filtro activo
 * @property {string} searchQuery - Query de búsqueda
 */

// Validadores de tipos (para runtime)
export const validators = {
  /**
   * Valida si un objeto es un Pokémon básico válido
   * @param {any} obj - Objeto a validar
   * @returns {boolean} Si es válido
   */
  isBasicPokemon(obj) {
    return (
      obj && typeof obj === 'object' && typeof obj.name === 'string' && typeof obj.url === 'string'
    )
  },

  /**
   * Valida si un objeto es un Pokémon detallado válido
   * @param {any} obj - Objeto a validar
   * @returns {boolean} Si es válido
   */
  isDetailedPokemon(obj) {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.id === 'number' &&
      typeof obj.name === 'string' &&
      obj.sprites &&
      Array.isArray(obj.types)
    )
  },

  /**
   * Valida si un objeto tiene la estructura de sprites válida
   * @param {any} obj - Objeto a validar
   * @returns {boolean} Si es válido
   */
  hasValidSprites(obj) {
    return (
      obj &&
      typeof obj === 'object' &&
      (obj.front_default === null || typeof obj.front_default === 'string')
    )
  },
}

export default validators
