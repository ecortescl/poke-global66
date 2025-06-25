<template>
    <div v-if="isVisible" class="bg-white mt-2 max-h-96 overflow-y-auto">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-4 text-center">
            <div class="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2">
            </div>
            <p class="text-gray-600 text-sm">Buscando Pokémon...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="p-4 text-center">
            <p class="text-red-600 text-sm">Error al buscar Pokémon</p>
        </div>

        <!-- Empty Results -->
        <div v-else-if="isEmpty" class="p-4 text-center">
            <p class="text-gray-500 text-sm">No se encontraron Pokémon</p>
        </div>

        <!-- Results List -->
        <div v-else class="space-y-0">
            <!-- Pokemon List Items -->
            <div v-for="pokemon in results" :key="pokemon.name"
                class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                @click="selectPokemon(pokemon)">
                <!-- Pokemon Name -->
                <span class="text-lg text-gray-800 capitalize font-normal">
                    {{ pokemon.name }}
                </span>

                <!-- Favorite Star -->
                <button @click.stop="toggleFavorite(pokemon)" :disabled="isProcessingFavorite"
                    class="p-2 transition-colors duration-150" :class="{ 'opacity-50': isProcessingFavorite }">
                    <svg class="h-6 w-6"
                        :class="isFavorite(pokemon.name) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'"
                        viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </button>
            </div>


        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchResultsList',

    props: {
        results: {
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
            default: ''
        },
        isProcessingFavorite: {
            type: Boolean,
            default: false
        }
    },

    emits: ['select-pokemon', 'toggle-favorite'],

    computed: {
        isVisible() {
            return this.query.length > 0 && (this.isLoading || this.hasError || this.results.length > 0 || this.isEmpty)
        },

        isEmpty() {
            return !this.isLoading && !this.hasError && this.results.length === 0 && this.query.length > 0
        }
    },

    methods: {
        selectPokemon(pokemon) {
            this.$emit('select-pokemon', pokemon)
        },

        toggleFavorite(pokemon) {
            this.$emit('toggle-favorite', pokemon)
        },



        isFavorite(pokemonName) {
            // Esta lógica se maneja desde el componente padre
            // que tiene acceso a los stores
            return this.$parent?.isFavorite?.(pokemonName) || false
        }
    }
}
</script>

<style scoped>
/* Estilos específicos para SearchResultsList */
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
</style>