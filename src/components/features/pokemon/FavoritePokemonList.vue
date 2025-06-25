<template>
    <div class="min-h-screen bg-gray-50 pb-20">
        <!-- Barra de búsqueda -->
        <div class="bg-white px-4 py-4 shadow-sm">
            <div class="container mx-auto max-w-md lg:max-w-none lg:w-3/5 relative">
                <input type="text" placeholder="Search" v-model="searchQuery"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        <!-- Lista de favoritos -->
        <div class="px-4 py-4">
            <div class="container mx-auto max-w-md lg:max-w-none lg:w-3/5">
                <div v-if="filteredFavorites.length > 0" class="space-y-4">
                    <div v-for="pokemon in filteredFavorites" :key="pokemon.name"
                        class="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        @click="openPokemonModal(pokemon)">
                        <!-- Información del Pokémon -->
                        <div class="flex items-center space-x-4">
                            <img :src="getPokemonImageUrl(pokemon)" :alt="pokemon.name" class="w-12 h-12 object-contain"
                                @error="(e) => handleImageError(e, pokemon)" />
                            <div>
                                <h3 class="text-lg font-medium text-gray-900 capitalize">
                                    {{ pokemon.name }}
                                </h3>
                                <span class="text-xs text-gray-500">
                                    #{{ String(pokemon.id || extractIdFromUrl(pokemon.url)).padStart(3, '0') }}
                                </span>
                            </div>
                        </div>

                        <!-- Botón de favorito -->
                        <button @click.stop="toggleFavorite(pokemon.name)" class="p-2" :disabled="isProcessingFavorite">
                            <svg class="w-6 h-6 text-orange-400 fill-current" viewBox="0 0 24 24">
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Estado vacío -->
                <div v-else class="text-center py-16">
                    <div class="text-6xl mb-4">💔</div>
                    <h3 class="text-xl font-medium text-gray-700 mb-2">
                        There are no favorites yet
                    </h3>
                    <p class="text-gray-500">
                        Add some Pokémon to your favorites to see them here
                    </p>
                </div>
            </div>
        </div>

        <!-- Modal de detalles del Pokémon -->
        <PokemonDetailModal :pokemon="selectedPokemon" :isVisible="isModalVisible" @close="closeModal" />
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'
import PokemonDetailModal from './PokemonDetailModal.vue'

export default {
    name: 'FavoritePokemonList',

    components: {
        PokemonDetailModal
    },

    data() {
        return {
            searchQuery: '',
            selectedPokemon: null,
            isModalVisible: false
        }
    },

    computed: {
        ...mapState(useFavoritesStore, ['favoritePokemons', 'isProcessingFavorite']),

        // Filtrar favoritos según la búsqueda
        filteredFavorites() {
            if (!this.searchQuery.trim()) {
                return this.favoritePokemons
            }

            const query = this.searchQuery.toLowerCase().trim()
            return this.favoritePokemons.filter(pokemon =>
                pokemon.name.toLowerCase().includes(query)
            )
        }
    },

    methods: {
        ...mapActions(useFavoritesStore, ['toggleFavorite']),

        // Obtener URL de imagen del Pokémon
        getPokemonImageUrl(pokemon) {
            // Los favoritos ya tienen ID directo, usar preferentemente
            const id = pokemon.id || this.extractIdFromUrl(pokemon.url)
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        },

        // Extraer ID de la URL
        extractIdFromUrl(url) {
            if (url && typeof url === 'string') {
                const urlParts = url.split('/')
                const id = urlParts[urlParts.length - 2]
                return id && !isNaN(id) ? id : '1'
            }
            return '1'
        },

        // Manejar error de imagen
        handleImageError(event, pokemon) {
            event.target.src = `https://via.placeholder.com/48x48/cccccc/666666?text=${pokemon.name.charAt(0).toUpperCase()}`
        },

        // Abrir modal con detalles del Pokémon
        openPokemonModal(pokemon) {
            this.selectedPokemon = pokemon
            this.isModalVisible = true
        },

        // Cerrar modal
        closeModal() {
            this.isModalVisible = false
            this.selectedPokemon = null
        }
    }
}
</script>