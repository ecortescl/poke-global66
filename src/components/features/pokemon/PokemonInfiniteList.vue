<template>
    <div class="w-full h-full overflow-y-auto pb-24" ref="scrollContainer" @scroll="handleScroll">
        <!-- Loading inicial -->
        <div v-if="isInitialLoading" class="flex items-center justify-center h-64">
            <div class="text-center">
                <div
                    class="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4">
                </div>
                <p class="text-gray-600">Loading Pokémon...</p>
            </div>
        </div>

        <!-- Lista de Pokémon -->
        <div v-else class="space-y-0">
            <div v-for="pokemon in displayedPokemons" :key="pokemon.name"
                class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 bg-white"
                @click="selectPokemon(pokemon)">
                <!-- Pokemon Info -->
                <div class="flex items-center space-x-4">
                    <!-- Pokemon Image -->
                    <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        <img v-if="pokemon.sprites?.front_default" :src="pokemon.sprites.front_default"
                            :alt="pokemon.name" class="w-10 h-10 object-contain" loading="lazy" />
                        <div v-else class="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>

                    <!-- Pokemon Details -->
                    <div>
                        <span class="text-lg text-gray-800 capitalize font-normal block">
                            {{ pokemon.name }}
                        </span>
                        <span v-if="pokemon.id" class="text-xs text-gray-500">
                            #{{ String(pokemon.id).padStart(3, '0') }}
                        </span>
                    </div>
                </div>

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

            <!-- Loading más Pokémon -->
            <div v-if="isLoadingMore" class="flex items-center justify-center py-8">
                <div class="text-center">
                    <div
                        class="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2">
                    </div>
                    <p class="text-gray-600 text-sm">Loading more Pokémon...</p>
                </div>
            </div>

            <!-- Final de la lista -->
            <div v-if="hasReachedEnd && displayedPokemons.length > 0" class="text-center py-8">
                <p class="text-gray-500">You have seen all the available Pokémon!</p>
            </div>
        </div>
    </div>
</template>

<script>
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'

export default {
    name: 'PokemonInfiniteList',

    emits: ['select-pokemon'],

    data() {
        return {
            displayedPokemons: [],
            isInitialLoading: true,
            isLoadingMore: false,
            currentPage: 0,
            pageSize: 20,
            pokemonsWithDetails: new Map(),
            isProcessingFavorite: false,
            hasReachedEnd: false
        }
    },

    computed: {
        pokemonStore() {
            return usePokemonStore()
        },

        favoritesStore() {
            return useFavoritesStore()
        }
    },

    async mounted() {
        await this.loadInitialPokemons()
    },

    methods: {
        async loadInitialPokemons() {
            this.isInitialLoading = true

            try {
                // Asegurar que tenemos la lista de Pokémon
                if (!this.pokemonStore.hasPokemonList) {
                    await this.pokemonStore.fetchAllPokemons(151) // Gen I
                }

                // Cargar primera página
                await this.loadMorePokemons()
            } catch (error) {
                console.error('Error loading initial pokemons:', error)
            } finally {
                this.isInitialLoading = false
            }
        },

        async loadMorePokemons() {
            if (this.isLoadingMore || this.hasReachedEnd) return

            this.isLoadingMore = true

            try {
                const startIndex = this.currentPage * this.pageSize
                const endIndex = startIndex + this.pageSize
                const pokemonBatch = this.pokemonStore.allPokemons.slice(startIndex, endIndex)

                if (pokemonBatch.length === 0) {
                    this.hasReachedEnd = true
                    return
                }

                // Obtener detalles para este lote
                const detailPromises = pokemonBatch.map(async (pokemon) => {
                    // Verificar si ya tenemos los detalles en cache
                    if (this.pokemonsWithDetails.has(pokemon.name)) {
                        return this.pokemonsWithDetails.get(pokemon.name)
                    }

                    try {
                        const details = await this.pokemonStore.fetchPokemonDetails(pokemon.url)
                        const pokemonWithDetails = {
                            ...pokemon,
                            id: details.id,
                            sprites: details.sprites,
                            types: details.types,
                            height: details.height,
                            weight: details.weight
                        }

                        // Guardar en cache local
                        this.pokemonsWithDetails.set(pokemon.name, pokemonWithDetails)
                        return pokemonWithDetails
                    } catch (error) {
                        console.warn(`Error fetching details for ${pokemon.name}:`, error)
                        return pokemon
                    }
                })

                const pokemonsWithDetails = await Promise.all(detailPromises)

                // Agregar a la lista mostrada
                this.displayedPokemons.push(...pokemonsWithDetails)
                this.currentPage++

                // Verificar si llegamos al final
                if (endIndex >= this.pokemonStore.allPokemons.length) {
                    this.hasReachedEnd = true
                }

            } catch (error) {
                console.error('Error loading more pokemons:', error)
            } finally {
                this.isLoadingMore = false
            }
        },

        handleScroll() {
            const container = this.$refs.scrollContainer
            if (!container) return

            const { scrollTop, scrollHeight, clientHeight } = container
            const threshold = 200 // Cargar cuando estés a 200px del final

            if (scrollTop + clientHeight >= scrollHeight - threshold) {
                this.loadMorePokemons()
            }
        },

        selectPokemon(pokemon) {
            this.$emit('select-pokemon', pokemon)
        },

        async toggleFavorite(pokemon) {
            this.isProcessingFavorite = true
            try {
                await this.favoritesStore.toggleFavorite(pokemon.name)
            } catch (error) {
                console.error('Error toggling favorite:', error)
            } finally {
                this.isProcessingFavorite = false
            }
        },

        isFavorite(pokemonName) {
            return this.favoritesStore.isPokemonFavorite(pokemonName)
        },

        // Método para refrescar la lista cuando se necesite
        async refresh() {
            this.displayedPokemons = []
            this.currentPage = 0
            this.hasReachedEnd = false
            this.pokemonsWithDetails.clear()
            await this.loadInitialPokemons()
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
</style>