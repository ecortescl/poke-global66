<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <!-- Header con barra de búsqueda -->
        <header class="w-full bg-gray-50 p-4">
            <div class="container mx-auto max-w-md relative">
                <SearchInput v-model="searchQuery" placeholder="Search" @search="handleSearch"
                    @focus="handleSearchFocus" @blur="handleSearchBlur" />

                <!-- Search Results Dropdown (solo para queries cortos) -->
                <SearchResultsList v-if="searchQuery.length > 0 && searchQuery.length < 3"
                    :results="filteredSearchResults" :isLoading="isSearching" :hasError="!!searchError"
                    :query="searchQuery" :isProcessingFavorite="isProcessingFavorite"
                    @select-pokemon="handleSelectPokemon" @toggle-favorite="handleToggleFavorite" />
            </div>
        </header>

        <!-- Contenido principal -->
        <main class="flex-1 overflow-hidden">
            <!-- PRIORIDAD 1: Cuando hay búsqueda activa (3+ caracteres), mostrar resultados de búsqueda -->
            <div v-if="hasSearchQuery && searchQuery.length >= 3" class="h-full overflow-y-auto pb-24">
                <div class="space-y-0">
                    <!-- Loading de búsqueda -->
                    <div v-if="isSearching" class="flex items-center justify-center h-32">
                        <div class="text-center">
                            <div
                                class="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2">
                            </div>
                            <p class="text-gray-600 text-sm">Buscando Pokémon...</p>
                        </div>
                    </div>

                    <!-- Error de búsqueda -->
                    <div v-else-if="searchError" class="flex items-center justify-center h-32">
                        <p class="text-red-600 text-sm">Error al buscar Pokémon</p>
                    </div>

                    <!-- No hay resultados -->
                    <div v-else-if="filteredSearchResults.length === 0" class="flex items-center justify-center h-32">
                        <p class="text-gray-500 text-sm">No se encontraron Pokémon</p>
                    </div>

                    <!-- Resultados de búsqueda con mismo diseño que lista infinita -->
                    <div v-else v-for="pokemon in filteredSearchResults" :key="pokemon.name"
                        class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 bg-white"
                        @click="handleSelectPokemon(pokemon)">
                        <!-- Pokemon Info -->
                        <div class="flex items-center space-x-4">
                            <!-- Pokemon Image -->
                            <div
                                class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
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
                        <button @click.stop="handleToggleFavorite(pokemon)" :disabled="isProcessingFavorite"
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

            <!-- PRIORIDAD 2: Sin búsqueda activa, mostrar según filtro -->
            <div v-else>
                <!-- 2A: Lista infinita cuando se presiona 'All' -->
                <PokemonInfiniteList v-if="currentFilter === 'all'" @select-pokemon="handleSelectPokemon"
                    ref="pokemonInfiniteList" />

                <!-- 2B: Lista de favoritos cuando se presiona 'Favorites' -->
                <div v-else-if="currentFilter === 'favorites'" class="h-full overflow-y-auto pb-24">
                    <div class="space-y-0">
                        <div v-for="pokemon in favoritePokemons" :key="pokemon.name"
                            class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 bg-white"
                            @click="handleSelectPokemon(pokemon)">
                            <!-- Pokemon Info -->
                            <div class="flex items-center space-x-4">
                                <!-- Pokemon Image -->
                                <div
                                    class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
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
                            <button @click.stop="handleToggleFavorite(pokemon)" :disabled="isProcessingFavorite"
                                class="p-2 transition-colors duration-150"
                                :class="{ 'opacity-50': isProcessingFavorite }">
                                <svg class="h-6 w-6 text-yellow-400 fill-current" viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path
                                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </button>
                        </div>

                        <!-- Empty favorites state -->
                        <div v-if="favoritePokemons.length === 0" class="flex items-center justify-center h-64">
                            <div class="text-center">
                                <svg class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <h3 class="text-lg font-medium text-gray-800 mb-2">No hay favoritos</h3>
                                <p class="text-gray-500">Agrega Pokémon a tus favoritos para verlos aquí</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2C: Vista por defecto (Uh-oh!) cuando no hay filtro activo -->
                <div v-else class="flex items-center justify-center h-full p-8">
                    <div class="text-center max-w-md">
                        <!-- Título principal -->
                        <h1 class="text-4xl font-bold text-gray-800 mb-4">
                            Uh-oh!
                        </h1>

                        <!-- Mensaje -->
                        <p class="text-lg text-gray-600 mb-8">
                            You look lost on your journey!
                        </p>

                        <!-- Botón de acción -->
                        <button @click="goBackHome"
                            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl">
                            Go back home
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Bottom Navigation - Siempre visible -->
        <BottomNavigation :activeTab="currentFilter" @tab-change="handleFilterChange" />
    </div>
</template>

<script>
import SearchInput from '@/components/SearchInput.vue'
import SearchResultsList from '@/components/SearchResultsList.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import PokemonInfiniteList from '@/components/PokemonInfiniteList.vue'
import { useSearchPokemon } from '@/composables/useSearchPokemon'
import { useFavoritesStore } from '@/stores/favorites'

export default {
    name: 'EmptyListView',

    components: {
        SearchInput,
        SearchResultsList,
        BottomNavigation,
        PokemonInfiniteList
    },

    data() {
        return {
            searchQuery: '',
            searchResults: [],
            isSearching: false,
            searchError: null,
            isProcessingFavorite: false,
            currentFilter: '', // Iniciar sin filtro
            searchLogic: null
        }
    },

    computed: {
        hasSearchQuery() {
            return this.searchQuery.length > 0
        },

        filteredSearchResults() {
            console.log('🎯 Vista - filteredSearchResults input:', this.searchResults.length)

            if (!this.searchResults.length) return []

            if (this.currentFilter === 'favorites') {
                const favorites = this.searchResults.filter(pokemon =>
                    this.searchLogic?.isFavorite?.(pokemon.name) || false
                )
                console.log('⭐ Vista - favoritos filtrados:', favorites.length)
                return favorites
            }

            console.log('📋 Vista - todos los resultados:', this.searchResults.length)
            return this.searchResults
        },

        favoritePokemons() {
            const favoritesStore = useFavoritesStore()
            return favoritesStore.favoritePokemons
        }
    },

    created() {
        // Inicializar la lógica de búsqueda
        this.searchLogic = useSearchPokemon()

        // Configurar reactividad manual
        this.updateReactiveState()
    },

    mounted() {
        // Configurar un watcher para actualizar el estado
        this.intervalId = setInterval(() => {
            this.updateReactiveState()
        }, 100)
    },

    beforeUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    },

    methods: {
        goBackHome() {
            this.$router.push('/home')
        },

        async handleSearch(query) {
            console.log('🔍 Búsqueda realizada:', query)
            this.searchQuery = query

            if (this.searchLogic) {
                await this.searchLogic.performSearch(query)
            }
        },

        handleSearchFocus() {
            console.log('📝 Input enfocado - listo para buscar')
        },

        handleSearchBlur() {
            // No limpiar la búsqueda al perder focus para mantener resultados
            console.log('👋 Input perdió focus')
        },

        handleSelectPokemon(pokemon) {
            console.log('🎯 Pokémon seleccionado:', pokemon.name)
            // Aquí puedes navegar a una vista de detalles del Pokémon
            // this.$router.push(`/pokemon/${pokemon.name}`)

            // Por ahora, mostrar información en consola
            console.log('Detalles del Pokémon:', pokemon)
        },

        async handleToggleFavorite(pokemon) {
            console.log('⭐ Toggle favorito:', pokemon.name)

            if (this.searchLogic) {
                await this.searchLogic.toggleFavorite(pokemon)
            }
        },

        // Método helper para que SearchResultsList pueda verificar favoritos
        isFavorite(pokemonName) {
            return this.searchLogic?.isFavorite?.(pokemonName) || false
        },

        handleFilterChange(filterType) {
            console.log('🔄 Cambio de filtro:', filterType)
            this.currentFilter = filterType

            // Si selecciona "all", limpiar la búsqueda para mostrar la lista infinita
            if (filterType === 'all') {
                this.searchQuery = ''
                this.searchResults = []
            }
        },

        updateReactiveState() {
            if (this.searchLogic) {
                const newResults = this.searchLogic.searchResults
                const newIsSearching = this.searchLogic.isSearching
                const newSearchError = this.searchLogic.searchError
                const newIsProcessingFavorite = this.searchLogic.isProcessingFavorite

                // Solo actualizar si cambió para evitar loops
                if (JSON.stringify(this.searchResults) !== JSON.stringify(newResults)) {
                    console.log('🔄 Actualizando resultados:', newResults.length)
                    this.searchResults = [...newResults]
                }

                if (this.isSearching !== newIsSearching) {
                    this.isSearching = newIsSearching
                }

                if (this.searchError !== newSearchError) {
                    this.searchError = newSearchError
                }

                if (this.isProcessingFavorite !== newIsProcessingFavorite) {
                    this.isProcessingFavorite = newIsProcessingFavorite
                }
            }
        }
    }
}
</script>

<style scoped>
/* Estilos específicos para EmptyListView */
</style>