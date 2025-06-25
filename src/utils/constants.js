/**
 * Constantes globales de la aplicación
 * Principio SOLID: Single Responsibility - Solo almacena constantes
 */

// API Configuration
export const API_CONFIG = {
  POKEMON_BASE_URL: 'https://pokeapi.co/api/v2',
  POKEMON_LIMIT: 151, // Solo primera generación
  DEFAULT_PAGE_SIZE: 20,
  MAX_SEARCH_RESULTS: 10,
}

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300, // ms para búsqueda
  SCROLL_THRESHOLD: 200, // px para infinite scroll
  ANIMATION_DURATION: 150, // ms para transiciones
  LOADING_DELAY: 500, // ms mínimo para mostrar loading
}

// Routes
export const ROUTES = {
  HOME: '/home',
  EMPTY_LIST: '/empty-list',
  LOADING: '/loading',
  WELCOME: '/',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: 'pokemon-favorites',
  USER_PREFERENCES: 'user-preferences',
  CACHE_TIMESTAMP: 'cache-timestamp',
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  POKEMON_NOT_FOUND: 'Pokémon no encontrado.',
  GENERIC_ERROR: 'Algo salió mal. Inténtalo de nuevo.',
  LOADING_ERROR: 'Error al cargar los datos.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  FAVORITE_ADDED: 'Pokémon agregado a favoritos',
  FAVORITE_REMOVED: 'Pokémon removido de favoritos',
  DATA_LOADED: 'Datos cargados correctamente',
}

// Filter Types
export const FILTER_TYPES = {
  ALL: 'all',
  FAVORITES: 'favorites',
}

// Pokemon Types (para futuras funcionalidades)
export const POKEMON_TYPES = {
  NORMAL: 'normal',
  FIRE: 'fire',
  WATER: 'water',
  ELECTRIC: 'electric',
  GRASS: 'grass',
  ICE: 'ice',
  FIGHTING: 'fighting',
  POISON: 'poison',
  GROUND: 'ground',
  FLYING: 'flying',
  PSYCHIC: 'psychic',
  BUG: 'bug',
  ROCK: 'rock',
  GHOST: 'ghost',
  DRAGON: 'dragon',
  DARK: 'dark',
  STEEL: 'steel',
  FAIRY: 'fairy',
}

export default {
  API_CONFIG,
  UI_CONFIG,
  ROUTES,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FILTER_TYPES,
  POKEMON_TYPES,
}
