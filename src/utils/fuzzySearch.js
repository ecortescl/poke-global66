/**
 * Utilidades para búsqueda difusa y sugerencias inteligentes
 * Principio SOLID: Single Responsibility - Solo maneja algoritmos de búsqueda
 */

/**
 * Calcula la distancia de Levenshtein entre dos strings
 * @param {string} a - Primer string
 * @param {string} b - Segundo string
 * @returns {number} Distancia de edición
 */
function levenshteinDistance(a, b) {
  const matrix = []

  // Inicializar matriz
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Llenar matriz
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitución
          matrix[i][j - 1] + 1, // inserción
          matrix[i - 1][j] + 1, // eliminación
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Calcula la similitud entre dos strings (0-1)
 * @param {string} a - Primer string
 * @param {string} b - Segundo string
 * @returns {number} Similitud (1 = idéntico, 0 = completamente diferente)
 */
function calculateSimilarity(a, b) {
  const maxLength = Math.max(a.length, b.length)
  if (maxLength === 0) return 1

  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase())
  return (maxLength - distance) / maxLength
}

/**
 * Busca coincidencias exactas por substring
 * @param {Array<Object>} pokemonList - Lista de Pokémon
 * @param {string} query - Término de búsqueda
 * @returns {Array<Object>} Pokémon que coinciden exactamente
 */
function exactSearch(pokemonList, query) {
  const normalizedQuery = query.toLowerCase().trim()

  return pokemonList.filter((pokemon) => pokemon.name.toLowerCase().includes(normalizedQuery))
}

/**
 * Busca coincidencias difusas usando similitud
 * @param {Array<Object>} pokemonList - Lista de Pokémon
 * @param {string} query - Término de búsqueda
 * @param {number} threshold - Umbral de similitud mínima (0-1)
 * @returns {Array<Object>} Pokémon ordenados por similitud
 */
function fuzzySearch(pokemonList, query, threshold = 0.4) {
  const normalizedQuery = query.toLowerCase().trim()

  const results = pokemonList
    .map((pokemon) => ({
      ...pokemon,
      similarity: calculateSimilarity(normalizedQuery, pokemon.name.toLowerCase()),
    }))
    .filter((pokemon) => pokemon.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)

  return results
}

/**
 * Busca por prefijo (útil para autocompletado)
 * @param {Array<Object>} pokemonList - Lista de Pokémon
 * @param {string} query - Término de búsqueda
 * @returns {Array<Object>} Pokémon que empiezan con el query
 */
function prefixSearch(pokemonList, query) {
  const normalizedQuery = query.toLowerCase().trim()

  return pokemonList.filter((pokemon) => pokemon.name.toLowerCase().startsWith(normalizedQuery))
}

/**
 * Busca por iniciales o acrónimos
 * @param {Array<Object>} pokemonList - Lista de Pokémon
 * @param {string} query - Término de búsqueda
 * @returns {Array<Object>} Pokémon que coinciden con iniciales
 */
function initialSearch(pokemonList, query) {
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, '')

  return pokemonList.filter((pokemon) => {
    const words = pokemon.name.toLowerCase().split(/[\s-]+/)
    const initials = words.map((word) => word.charAt(0)).join('')
    return initials.includes(normalizedQuery)
  })
}

/**
 * Función principal de búsqueda inteligente
 * @param {Array<Object>} pokemonList - Lista de Pokémon
 * @param {string} query - Término de búsqueda
 * @param {Object} options - Opciones de búsqueda
 * @returns {Object} Resultado con coincidencias exactas y sugerencias
 */
export function intelligentSearch(pokemonList, query, options = {}) {
  const {
    maxExactResults = 10,
    maxSuggestions = 5,
    similarityThreshold = 0.4,
    minQueryLength = 2,
  } = options

  // Validar entrada
  if (!query || query.length < minQueryLength) {
    return {
      exact: [],
      suggestions: [],
      hasResults: false,
      searchType: 'none',
    }
  }

  // 1. Búsqueda exacta (substring)
  const exactResults = exactSearch(pokemonList, query)

  if (exactResults.length > 0) {
    return {
      exact: exactResults.slice(0, maxExactResults),
      suggestions: [],
      hasResults: true,
      searchType: 'exact',
    }
  }

  // 2. Búsqueda por prefijo
  const prefixResults = prefixSearch(pokemonList, query)

  if (prefixResults.length > 0) {
    return {
      exact: prefixResults.slice(0, maxExactResults),
      suggestions: [],
      hasResults: true,
      searchType: 'prefix',
    }
  }

  // 3. Búsqueda por iniciales
  const initialResults = initialSearch(pokemonList, query)

  if (initialResults.length > 0) {
    return {
      exact: initialResults.slice(0, maxExactResults),
      suggestions: [],
      hasResults: true,
      searchType: 'initial',
    }
  }

  // 4. Búsqueda difusa (sugerencias)
  const fuzzyResults = fuzzySearch(pokemonList, query, similarityThreshold)

  if (fuzzyResults.length > 0) {
    return {
      exact: [],
      suggestions: fuzzyResults.slice(0, maxSuggestions),
      hasResults: true,
      searchType: 'fuzzy',
      message: `¿Quizás estás buscando alguno de estos Pokémon?`,
    }
  }

  // 5. Sin resultados
  return {
    exact: [],
    suggestions: [],
    hasResults: false,
    searchType: 'none',
    message: `No se encontraron Pokémon que coincidan con "${query}"`,
  }
}

/**
 * Genera sugerencias de búsqueda basadas en errores comunes
 * @param {string} query - Término de búsqueda
 * @returns {Array<string>} Sugerencias de corrección
 */
export function generateSearchSuggestions(query) {
  const suggestions = []
  const normalized = query.toLowerCase().trim()

  // Correcciones comunes de Pokémon
  const commonCorrections = {
    pikachu: ['pikachu', 'pika', 'pikach'],
    charizard: ['charizard', 'charizrd', 'chrizard'],
    blastoise: ['blastoise', 'blastois', 'blastoice'],
    venusaur: ['venusaur', 'venosaur', 'venusuar'],
    mewtwo: ['mewtwo', 'mew two', 'mewtoo'],
    mew: ['mew', 'meu'],
    squirtle: ['squirtle', 'squirtel', 'squirtl'],
    bulbasaur: ['bulbasaur', 'bulbasur', 'bulbosaur'],
    charmander: ['charmander', 'charmandr', 'charmander'],
  }

  // Buscar correcciones
  for (const [correct, variations] of Object.entries(commonCorrections)) {
    if (variations.some((variation) => calculateSimilarity(normalized, variation) > 0.6)) {
      suggestions.push(correct)
    }
  }

  return suggestions
}

export default {
  intelligentSearch,
  generateSearchSuggestions,
  calculateSimilarity,
  levenshteinDistance,
}
