<template>
    <div class="min-h-screen bg-gray-50 pb-20">
        <!-- Barra de búsqueda -->
        <div class="bg-white px-4 py-4 shadow-sm">
            <div class="relative">
                <input type="text" placeholder="Search" v-model="searchQuery"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        <!-- Lista de Pokémon -->
        <div class="px-4 py-4">
            <div v-if="paginatedPokemons.length > 0" class="space-y-4">
                <div v-for="pokemon in paginatedPokemons" :key="pokemon.name"
                    class="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                    <!-- Información del Pokémon -->
                    <div class="flex items-center space-x-4">
                        <img :src="getPokemonImageUrl(pokemon)" :alt="pokemon.name" class="w-12 h-12 object-contain"
                            @error="(e) => handleImageError(e, pokemon)" />
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 capitalize">
                                {{ pokemon.name }}
                            </h3>
                        </div>
                    </div>

                    <!-- Botón de favorito -->
                    <button @click="toggleFavorite(pokemon.name)" class="p-2" :disabled="isProcessingFavorite">
                        <svg :class="isFavorite(pokemon.name) ? 'text-orange-400 fill-current' : 'text-gray-300'"
                            class="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Estado vacío -->
            <div v-else-if="!isLoading" class="text-center py-16">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-xl font-medium text-gray-700 mb-2">
                    No se encontraron Pokémon
                </h3>
                <p class="text-gray-500">
                    Intenta con otro término de búsqueda
                </p>
            </div>

            <!-- Paginación -->
            <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-4">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors">
                    ← Anterior
                </button>

                <div class="flex gap-2">
                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                        page === currentPage
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                        'px-3 py-2 rounded-lg transition-colors'
                    ]">
                        {{ page }}
                    </button>
                </div>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors">
                    Siguiente →
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'

export default {
    name: 'PokemonList',

    data() {
        return {
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 20
        }
    },

    computed: {
        ...mapState(usePokemonStore, ['allPokemons', 'isLoading']),
        ...mapState(useFavoritesStore, ['isProcessingFavorite']),

        // Filtrar Pokémon por búsqueda
        filteredPokemons() {
            if (!this.searchQuery.trim()) {
                return this.allPokemons
            }

            const query = this.searchQuery.toLowerCase().trim()
            return this.allPokemons.filter(pokemon =>
                pokemon.name.toLowerCase().includes(query)
            )
        },

        // Pokémon paginados
        paginatedPokemons() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage
            const endIndex = startIndex + this.itemsPerPage
            return this.filteredPokemons.slice(startIndex, endIndex)
        },

        // Total de páginas
        totalPages() {
            return Math.ceil(this.filteredPokemons.length / this.itemsPerPage)
        },

        // Páginas visibles en la paginación
        visiblePages() {
            const totalVisible = 5
            const halfVisible = Math.floor(totalVisible / 2)

            let startPage = Math.max(1, this.currentPage - halfVisible)
            let endPage = Math.min(this.totalPages, startPage + totalVisible - 1)

            if (endPage - startPage < totalVisible - 1) {
                startPage = Math.max(1, endPage - totalVisible + 1)
            }

            const pages = []
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }

            return pages
        }
    },

    methods: {
        ...mapActions(useFavoritesStore, ['toggleFavorite']),

        // Verificar si un Pokémon es favorito
        isFavorite(pokemonName) {
            const favoritesStore = useFavoritesStore()
            return favoritesStore.isPokemonFavorite(pokemonName)
        },

        // Obtener URL de imagen del Pokémon
        getPokemonImageUrl(pokemon) {
            const id = this.extractIdFromUrl(pokemon.url)
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        },

        // Extraer ID de la URL
        extractIdFromUrl(url) {
            if (url) {
                const urlParts = url.split('/')
                return urlParts[urlParts.length - 2]
            }
            return '1'
        },

        // Manejar error de imagen
        handleImageError(event, pokemon) {
            event.target.src = `https://via.placeholder.com/48x48/cccccc/666666?text=${pokemon.name.charAt(0).toUpperCase()}`
        },

        // Navegación de páginas
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--
                this.scrollToTop()
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++
                this.scrollToTop()
            }
        },

        goToPage(page) {
            this.currentPage = page
            this.scrollToTop()
        },

        // Scroll suave hacia arriba cuando cambia de página
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    },

    watch: {
        // Resetear página cuando cambia la búsqueda
        searchQuery() {
            this.currentPage = 1
        }
    }
}
</script>