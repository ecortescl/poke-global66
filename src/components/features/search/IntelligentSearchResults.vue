<template>
    <div v-if="isVisible" class="bg-white rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto border border-gray-200">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-6 text-center">
            <div class="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-3">
            </div>
            <p class="text-gray-600">Buscando Pokémon...</p>
            <p class="text-gray-400 text-sm mt-1">Analizando resultados...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="p-6 text-center">
            <div class="text-red-500 mb-3">
                <svg class="h-12 w-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </div>
            <p class="text-red-600 font-medium">Error al buscar Pokémon</p>
            <p class="text-gray-500 text-sm mt-1">Inténtalo de nuevo</p>
        </div>

        <!-- No Results State -->
        <div v-else-if="isEmpty" class="p-6 text-center">
            <div class="text-gray-400 mb-3">
                <svg class="h-12 w-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
            </div>
            <p class="text-gray-600 font-medium">No se encontraron Pokémon</p>
            <p class="text-gray-500 text-sm mt-1">Intenta con otro término de búsqueda</p>
        </div>

        <!-- Results -->
        <div v-else>
            <!-- Search Message -->
            <div v-if="searchMessage" class="px-6 py-3 bg-blue-50 border-b border-blue-100">
                <p class="text-blue-800 text-sm font-medium">{{ searchMessage }}</p>
            </div>

            <!-- Exact Results -->
            <div v-if="exactResults.length > 0">
                <div v-if="searchType !== \"exact\"" class="px-6 py-2 bg-green-50 border-b border-green-100">
                    <p class="text-green-800 text-sm font-medium">✅ Resultados encontrados</p>
                </div>
                
                <div class="space-y-0">
                    <div v-for="pokemon in exactResults" :key="`exact-${pokemon.name}`"
                        class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                        @click="selectPokemon(pokemon)">
                        
                        <!-- Pokemon Info -->
                        <div class="flex items-center space-x-4">
                            <!-- Pokemon Image -->
                            <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                <img 
                                    v-if="pokemon.sprites?.front_default" 
                                    :src="pokemon.sprites.front_default" 
                                    :alt="pokemon.name"
                                    class="w-8 h-8 object-contain"
                                    loading="lazy"
                                />
                                <div v-else class="w-6 h-6 bg-gray-300 rounded-full"></div>
                            </div>
                            
                            <!-- Pokemon Details -->
                            <div>
                                <span class="text-lg text-gray-800 capitalize font-medium">
                                    {{ pokemon.name }}
                                </span>
                                <span v-if="pokemon.id" class="text-xs text-gray-500 ml-2">
                                    #{{ String(pokemon.id).padStart(3, "0") }}
                                </span>
                            </div>
                        </div>

                        <!-- Favorite Star -->
                        <button @click.stop="toggleFavorite(pokemon)" :disabled="isProcessingFavorite"
                            class="p-2 transition-colors duration-150" :class="{ \"opacity-50\": isProcessingFavorite }">
                            <svg class="h-5 w-5"
                                :class="isFavorite(pokemon.name) ? \"text-yellow-400 fill-current\" : \"text-gray-300 fill-current\""
                                viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Suggestions -->
            <div v-if="suggestions.length > 0">
                <div class="px-6 py-2 bg-yellow-50 border-b border-yellow-100">
                    <p class="text-yellow-800 text-sm font-medium">
                        💡 {{ searchType === \"fuzzy\" ? \"Sugerencias\" : \"Quizás quisiste decir\" }}
                    </p>
                </div>
                
                <div class="space-y-0">
                    <div v-for="pokemon in suggestions" :key="`suggestion-${pokemon.name}`"
                        class="flex items-center justify-between px-6 py-4 hover:bg-yellow-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                        @click="applySuggestion(pokemon)">
                        
                        <!-- Pokemon Info -->
                        <div class="flex items-center space-x-4">
                            <!-- Pokemon Image -->
                            <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                <img 
                                    v-if="pokemon.sprites?.front_default" 
                                    :src="pokemon.sprites.front_default" 
                                    :alt="pokemon.name"
                                    class="w-8 h-8 object-contain"
                                    loading="lazy"
                                />
                                <div v-else class="w-6 h-6 bg-gray-300 rounded-full"></div>
                            </div>
                            
                            <!-- Pokemon Details -->
                            <div>
                                <span class="text-lg text-gray-700 capitalize font-medium">
                                    {{ pokemon.name }}
                                </span>
                                <span v-if="pokemon.id" class="text-xs text-gray-500 ml-2">
                                    #{{ String(pokemon.id).padStart(3, "0") }}
                                </span>
                                <div v-if="pokemon.similarity" class="text-xs text-yellow-600 mt-1">
                                    {{ Math.round(pokemon.similarity * 100) }}% coincidencia
                                </div>
                            </div>
                        </div>

                        <!-- Action Button -->
                        <div class="flex items-center space-x-2">
                            <!-- Favorite Star -->
                            <button @click.stop="toggleFavorite(pokemon)" :disabled="isProcessingFavorite"
                                class="p-2 transition-colors duration-150" :class="{ \"opacity-50\": isProcessingFavorite }">
                                <svg class="h-5 w-5"
                                    :class="isFavorite(pokemon.name) ? \"text-yellow-400 fill-current\" : \"text-gray-300 fill-current\""
                                    viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </button>
                            
                            <!-- Search This Button -->
                            <button @click.stop="applySuggestion(pokemon)"
                                class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-150">
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "IntelligentSearchResults",

    props: {
        exactResults: {
            type: Array,
            default: () => []
        },
        suggestions: {
            type: Array,
            default: () => []
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        hasError: {
            type: Boolean,
            default: false
        },
        query: {
            type: String,
            default: ""
        },
        searchType: {
            type: String,
            default: "none"
        },
        searchMessage: {
            type: String,
            default: ""
        },
        isProcessingFavorite: {
            type: Boolean,
            default: false
        }
    },

    emits: ["select-pokemon", "toggle-favorite", "apply-suggestion"],

    computed: {
        isVisible() {
            return this.query.length > 0 && (
                this.isLoading || 
                this.hasError || 
                this.exactResults.length > 0 || 
                this.suggestions.length > 0 || 
                this.isEmpty
            )
        },

        isEmpty() {
            return !this.isLoading && 
                   !this.hasError && 
                   this.exactResults.length === 0 && 
                   this.suggestions.length === 0 && 
                   this.query.length > 0
        }
    },

    methods: {
        selectPokemon(pokemon) {
            this.$emit("select-pokemon", pokemon)
        },

        toggleFavorite(pokemon) {
            this.$emit("toggle-favorite", pokemon)
        },

        applySuggestion(pokemon) {
            this.$emit("apply-suggestion", pokemon)
        },

        isFavorite(pokemonName) {
            return this.$parent?.isFavorite?.(pokemonName) || false
        }
    }
}
</script>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.border-3 {
    border-width: 3px;
}
</style>
