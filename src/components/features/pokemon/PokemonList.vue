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

        <!-- Lista de Pokémon con Scroll Infinito -->
        <div class="px-4 py-4">
            <div class="container mx-auto max-w-md lg:max-w-none lg:w-3/5">
                <div v-if="displayedPokemons.length > 0" class="space-y-4">
                    <div v-for="pokemon in displayedPokemons" :key="pokemon.name"
                        class="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        @click="openPokemonModal(pokemon)">
                        <!-- Información del Pokémon -->
                        <div class="flex items-center space-x-4">
                            <!-- Contenedor de imagen con animación de captura -->
                            <div class="relative w-12 h-12 z-10">
                                <!-- Imagen del Pokémon (solo si no es favorito o se está liberando) -->
                                <img v-if="!isFavorite(pokemon.name) || releasingPokemon === pokemon.name"
                                    :src="getPokemonImageUrl(pokemon)" :alt="pokemon.name"
                                    class="w-12 h-12 object-contain transition-all duration-300" :class="{
                                        'pokemon-capturing': capturingPokemon === pokemon.name,
                                        'opacity-0': releasingPokemon === pokemon.name
                                    }" @error="(e) => handleImageError(e, pokemon)" />

                                <!-- Pokeball estática (cuando ya es favorito y no se está procesando) -->
                                <Pokeball
                                    v-if="isFavorite(pokemon.name) && capturingPokemon !== pokemon.name && releasingPokemon !== pokemon.name"
                                    state="static" class="absolute inset-0 z-20" />

                                <!-- Pokeball con animación de captura -->
                                <Pokeball v-if="capturingPokemon === pokemon.name" state="capturing"
                                    class="absolute inset-0 z-30" />

                                <!-- Pokeball con animación de liberación -->
                                <Pokeball v-if="releasingPokemon === pokemon.name" state="releasing"
                                    class="absolute inset-0 z-30" />
                            </div>

                            <div>
                                <h3 class="text-lg font-medium text-gray-900 capitalize">
                                    {{ pokemon.name }}
                                </h3>
                            </div>
                        </div>

                        <!-- Botón de favorito -->
                        <button @click.stop="handleToggleFavorite(pokemon)" class="p-2"
                            :disabled="isProcessingFavorite">
                            <svg :class="isFavorite(pokemon.name) ? 'text-orange-400 fill-current' : 'text-gray-300'"
                                class="w-6 h-6" viewBox="0 0 24 24">
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Estado vacío -->
                <div v-else-if="!isLoading && filteredPokemons.length === 0" class="text-center py-16">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-medium text-gray-700 mb-2">
                        No Pokémon found
                    </h3>
                    <p class="text-gray-500">
                        Try with another search term
                    </p>
                </div>

                <!-- Loading indicator para scroll infinito -->
                <div v-if="isLoadingMore" class="flex justify-center items-center py-8">
                    <div class="flex items-center space-x-3">
                        <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent">
                        </div>
                        <span class="text-gray-600">Loading more Pokémon...</span>
                    </div>
                </div>

                <!-- Sentinel element para detectar scroll -->
                <div ref="sentinel" class="h-10 w-full"></div>
            </div>
        </div>

        <!-- Modal de detalles del Pokémon -->
        <PokemonDetailModal :pokemon="selectedPokemon" :isVisible="isModalVisible" @close="closeModal" />
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import { Pokeball } from '@/components/ui'
import PokemonDetailModal from './PokemonDetailModal.vue'

export default {
    name: 'PokemonList',

    components: {
        Pokeball,
        PokemonDetailModal
    },

    data() {
        return {
            searchQuery: '',
            displayedCount: 10, // Comenzar con 10 Pokémon
            isLoadingMore: false,
            observer: null,
            capturingPokemon: null, // Pokémon que está siendo capturado
            releasingPokemon: null,  // Pokémon que está siendo liberado
            selectedPokemon: null, // Pokémon seleccionado para el modal
            isModalVisible: false // Controlar visibilidad del modal
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

        // Pokémon que se muestran actualmente
        displayedPokemons() {
            return this.filteredPokemons.slice(0, this.displayedCount)
        },

        // Verificar si hay más Pokémon para cargar
        hasMorePokemons() {
            return this.displayedCount < this.filteredPokemons.length
        }
    },

    methods: {
        ...mapActions(useFavoritesStore, ['toggleFavorite']),

        // Verificar si un Pokémon es favorito
        isFavorite(pokemonName) {
            const favoritesStore = useFavoritesStore()
            return favoritesStore.isPokemonFavorite(pokemonName)
        },

        // Manejar toggle de favorito con animación
        async handleToggleFavorite(pokemon) {
            const wasFavorite = this.isFavorite(pokemon.name)

            if (!wasFavorite) {
                // Capturar
                this.capturingPokemon = pokemon.name

                setTimeout(async () => {
                    await this.toggleFavorite(pokemon.name)

                    setTimeout(() => {
                        this.capturingPokemon = null
                    }, 500)
                }, 100)
            } else {
                // Liberar
                this.releasingPokemon = pokemon.name

                setTimeout(async () => {
                    await this.toggleFavorite(pokemon.name)

                    setTimeout(() => {
                        this.releasingPokemon = null
                    }, 300)
                }, 100)
            }
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

        // Cargar más Pokémon
        async loadMorePokemons() {
            if (this.isLoadingMore || !this.hasMorePokemons) {
                return
            }

            this.isLoadingMore = true

            // Pequeño delay para UX
            await new Promise(resolve => setTimeout(resolve, 300))

            // Incrementar cantidad mostrada
            this.displayedCount = Math.min(
                this.displayedCount + 10,
                this.filteredPokemons.length
            )

            this.isLoadingMore = false
        },

        // Configurar Intersection Observer
        setupIntersectionObserver() {
            if (this.observer) {
                this.observer.disconnect()
            }

            const options = {
                root: null,
                rootMargin: '100px',
                threshold: 0.1
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && this.hasMorePokemons && !this.isLoadingMore) {
                        this.loadMorePokemons()
                    }
                })
            }, options)

            if (this.$refs.sentinel) {
                this.observer.observe(this.$refs.sentinel)
            }
        },

        // Resetear lista cuando cambia la búsqueda
        resetList() {
            this.displayedCount = 10
            this.$nextTick(() => {
                this.setupIntersectionObserver()
            })
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
    },

    watch: {
        // Resetear cuando cambia la búsqueda
        searchQuery() {
            this.resetList()
        },

        // Configurar observer cuando los datos están listos
        allPokemons(newVal) {
            if (newVal.length > 0) {
                this.$nextTick(() => {
                    this.setupIntersectionObserver()
                })
            }
        }
    },

    mounted() {
        this.setupIntersectionObserver()
    },

    beforeUnmount() {
        if (this.observer) {
            this.observer.disconnect()
        }
    }
}
</script>

<style scoped>
/* Efecto de captura para el Pokémon */
.pokemon-capturing {
    filter: hue-rotate(180deg) contrast(1.5) brightness(0.8);
    animation: pokemonCapture 2s ease-in-out;
}

@keyframes pokemonCapture {
    0% {
        filter: hue-rotate(0deg) contrast(1) brightness(1);
        transform: scale(1);
    }

    25% {
        filter: hue-rotate(90deg) contrast(1.3) brightness(0.9);
        transform: scale(1.05);
    }

    50% {
        filter: hue-rotate(180deg) contrast(1.5) brightness(0.8);
        transform: scale(0.95);
    }

    75% {
        filter: hue-rotate(270deg) contrast(1.3) brightness(0.9);
        transform: scale(1.02);
    }

    100% {
        filter: hue-rotate(360deg) contrast(1) brightness(1);
        transform: scale(1);
    }
}
</style>