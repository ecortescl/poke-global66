<template>
    <div class="w-full">
        <!-- Header con búsqueda -->
        <div class="mb-8 bg-white rounded-lg shadow-md p-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800 mb-2">
                        🌟 Todos los Pokémon
                    </h2>
                    <p class="text-gray-600">
                        Descubre y colecciona tus Pokémon favoritos
                    </p>
                </div>

                <!-- Barra de búsqueda -->
                <div class="relative w-full md:w-96">
                    <input v-model="searchQuery" type="text" placeholder="Buscar Pokémon por nombre..."
                        class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200" />
                    <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        🔍
                    </div>

                    <!-- Botón para limpiar búsqueda -->
                    <button v-if="searchQuery" @click="clearSearch"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                </div>
            </div>

            <!-- Estadísticas -->
            <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <div class="bg-blue-100 px-3 py-1 rounded-full">
                    📊 Total: {{ allPokemons.length }} Pokémon
                </div>
                <div class="bg-green-100 px-3 py-1 rounded-full">
                    ✨ Mostrando: {{ filteredPokemons.length }} Pokémon
                </div>
                <div class="bg-red-100 px-3 py-1 rounded-full">
                    ❤️ Favoritos: {{ favoritesCount }}
                </div>
            </div>
        </div>

        <!-- Lista de Pokemon -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <PokemonCard v-for="pokemon in paginatedPokemons" :key="pokemon.name" :pokemon="pokemon" />
        </div>

        <!-- Mensaje cuando no hay resultados -->
        <div v-if="filteredPokemons.length === 0 && !isLoading" class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron Pokémon
            </h3>
            <p class="text-gray-500 mb-4">
                Intenta con otro término de búsqueda
            </p>
            <button @click="clearSearch"
                class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                Limpiar búsqueda
            </button>
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

        <!-- Información de paginación -->
        <div v-if="totalPages > 1" class="mt-4 text-center text-gray-600 text-sm">
            Página {{ currentPage }} de {{ totalPages }}
            ({{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredPokemons.length)
            }} de {{ filteredPokemons.length }})
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import { PokemonCard } from './index.js'

export default {
    name: 'PokemonList',
    components: {
        PokemonCard
    },

    data() {
        return {
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 20, // Cantidad de Pokemon por página
        }
    },

    computed: {
        ...mapState(usePokemonStore, ['allPokemons', 'isLoading']),
        ...mapState(useFavoritesStore, ['favoritesCount']),

        // Filtrar Pokemon por búsqueda
        filteredPokemons() {
            if (!this.searchQuery.trim()) {
                return this.allPokemons
            }

            const query = this.searchQuery.toLowerCase().trim()
            return this.allPokemons.filter(pokemon =>
                pokemon.name.toLowerCase().includes(query)
            )
        },

        // Pokemon paginados
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

            // Ajustar si estamos cerca del final
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
        ...mapActions(usePokemonStore, ['fetchAllPokemons']),

        // Limpiar búsqueda
        clearSearch() {
            this.searchQuery = ''
            this.currentPage = 1
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
        },

        // Reiniciar página cuando cambia la búsqueda
        resetPagination() {
            this.currentPage = 1
        }
    },

    watch: {
        // Observar cambios en la búsqueda para reiniciar la paginación
        searchQuery() {
            this.resetPagination()
        }
    },

    // Cargar Pokemon al montar el componente
    async created() {
        if (this.allPokemons.length === 0) {
            await this.fetchAllPokemons()
        }
    }
}
</script>