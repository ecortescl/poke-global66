<template>
    <!-- Modal Backdrop -->
    <div v-if="isVisible"
        class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center modal-overlay p-4"
        @click="closeModal">
        <!-- Modal Content -->
        <div class="relative bg-white rounded-lg w-full max-w-sm mx-auto" @click.stop>
            <!-- Close Button -->
            <button @click="closeModal"
                class="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>

            <!-- Pokemon Image Background -->
            <div class="relative h-64 rounded-t-lg overflow-hidden"
                :style="{ backgroundImage: 'url(/bgDetails.png)', backgroundSize: 'cover', backgroundPosition: 'center' }">

                <!-- Pokeball pequeña en esquina superior izquierda (cuando ya es favorito) -->
                <div v-if="isFavorite && !capturingPokemon" class="absolute top-4 left-4 z-20 pokeball-corner">
                    <Pokeball state="static" :size="30" />
                </div>

                <!-- Pokemon Image -->
                <div class="flex items-center justify-center h-full relative">
                    <!-- Imagen del Pokémon (siempre visible excepto durante animación de captura completa) -->
                    <img v-if="!showingFullCaptureAnimation" :src="pokemonImageUrl" :alt="pokemon.name"
                        class="w-40 h-40 object-contain z-10 transition-all duration-300" :class="{
                            'pokemon-capturing': capturingPokemon
                        }" @error="handleImageError" />

                    <!-- Pokeball con animación de captura (solo para nuevas capturas) -->
                    <div v-if="capturingPokemon" class="absolute inset-0 flex items-center justify-center">
                        <div class="pokeball-capture-medium">
                            <Pokeball state="capturing" :size="80" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pokemon Details -->
            <div class="p-6 space-y-4">
                <!-- Name -->
                <div>
                    <span class="text-gray-600 text-sm">Name:</span>
                    <span class="text-gray-800 font-medium ml-1 capitalize">{{ pokemon.name }}</span>
                </div>

                <!-- Weight -->
                <div>
                    <span class="text-gray-600 text-sm">Weight:</span>
                    <span class="text-gray-800 font-medium ml-1">{{ pokemonWeight }}</span>
                </div>

                <!-- Height -->
                <div>
                    <span class="text-gray-600 text-sm">Height:</span>
                    <span class="text-gray-800 font-medium ml-1">{{ pokemonHeight }}</span>
                </div>

                <!-- Types -->
                <div>
                    <span class="text-gray-600 text-sm">Types:</span>
                    <span class="text-gray-800 font-medium ml-1">{{ pokemonTypes }}</span>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-between pt-4">
                    <!-- Share Button -->
                    <button @click="sharePokemon"
                        class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
                        Share to my friends
                    </button>

                    <!-- Favorite Star -->
                    <button @click="handleToggleFavorite" class="p-2 hover:scale-110 transition-transform"
                        :disabled="isProcessingFavorite">
                        <svg :class="isFavorite ? 'text-orange-400 fill-current' : 'text-gray-300'"
                            class="w-8 h-8 transition-colors" viewBox="0 0 24 24">
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Alerta de éxito -->
        <SuccessAlert :visible="showSuccessAlert" :message="alertMessage" @close="closeAlert" />
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'
import { usePokemonStore } from '@/stores/pokemon'
import { Pokeball, SuccessAlert } from '@/components/ui'

export default {
    name: 'PokemonDetailModal',

    components: {
        Pokeball,
        SuccessAlert
    },

    props: {
        pokemon: {
            type: Object,
            default: null
        },
        isVisible: {
            type: Boolean,
            default: false
        }
    },

    emits: ['close'],

    data() {
        return {
            pokemonDetails: null,
            isLoadingDetails: false,
            capturingPokemon: false,
            releasingPokemon: false,
            showingFullCaptureAnimation: false,
            wasAlreadyFavorite: false,
            showSuccessAlert: false,
            alertMessage: ''
        }
    },

    computed: {
        ...mapState(useFavoritesStore, ['isProcessingFavorite']),

        // Verificar si es favorito
        isFavorite() {
            if (!this.pokemon) return false
            const favoritesStore = useFavoritesStore()
            return favoritesStore.isPokemonFavorite(this.pokemon.name)
        },

        // URL de imagen del Pokémon
        pokemonImageUrl() {
            if (!this.pokemon) return ''
            // Si el pokemon tiene ID directo (favoritos), usarlo
            // Si no, extraer de la URL (lista normal)
            const id = this.pokemon.id || this.extractIdFromUrl(this.pokemon.url)
            console.log(`🐛 Debug Modal - Pokemon: ${this.pokemon.name}, ID usado: ${id}, Pokemon completo:`, this.pokemon)
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        },

        // Peso formateado
        pokemonWeight() {
            if (!this.pokemonDetails?.weight) return 'Unknown'
            return `${(this.pokemonDetails.weight / 10).toFixed(1)} kg`
        },

        // Altura formateada
        pokemonHeight() {
            if (!this.pokemonDetails?.height) return 'Unknown'
            return `${(this.pokemonDetails.height / 10).toFixed(1)} m`
        },

        // Tipos formateados
        pokemonTypes() {
            if (!this.pokemonDetails?.types) return 'Unknown'
            return this.pokemonDetails.types
                .map(type => this.capitalizeFirst(type.type.name))
                .join(', ')
        }
    },

    methods: {
        ...mapActions(useFavoritesStore, ['toggleFavorite']),
        ...mapActions(usePokemonStore, ['fetchPokemonDetails']),

        // Cerrar modal
        closeModal() {
            this.$emit('close')
        },

        // Toggle favorito con animación
        async handleToggleFavorite() {
            if (!this.pokemon) return

            const wasFavorite = this.isFavorite

            if (!wasFavorite) {
                // Capturar - Mostrar animación completa
                this.capturingPokemon = true
                this.showingFullCaptureAnimation = true

                setTimeout(async () => {
                    await this.toggleFavorite(this.pokemon.name)

                    setTimeout(() => {
                        this.capturingPokemon = false
                        this.showingFullCaptureAnimation = false
                    }, 500)
                }, 100)
            } else {
                // Liberar - Solo quitar pokeball de esquina
                await this.toggleFavorite(this.pokemon.name)
            }
        },

        // Compartir Pokémon
        async sharePokemon() {
            if (!this.pokemon || !this.pokemonDetails) return

            // Formato: Nombre, Tipos, Altura, Peso
            const shareText = `${this.capitalizeFirst(this.pokemon.name)}, ${this.pokemonTypes}, ${this.pokemonHeight}, ${this.pokemonWeight}`

            try {
                await navigator.clipboard.writeText(shareText)
                this.showNotification('✅ Pokémon information copied to clipboard!')
            } catch (error) {
                console.error('Error copying to clipboard:', error)
                this.fallbackShare(shareText)
            }
        },

        // Fallback para compartir
        fallbackShare(text) {
            const textarea = document.createElement('textarea')
            textarea.value = text
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            this.showNotification('✅ Pokémon information copied to clipboard!')
        },

        // Mostrar notificación
        showNotification(message) {
            this.alertMessage = message
            this.showSuccessAlert = true
        },

        // Cerrar alerta
        closeAlert() {
            this.showSuccessAlert = false
            this.alertMessage = ''
        },

        // Extraer ID de URL
        extractIdFromUrl(url) {
            if (url && typeof url === 'string') {
                const urlParts = url.split('/')
                const id = urlParts[urlParts.length - 2]
                return id && !isNaN(id) ? id : '1'
            }
            return '1'
        },

        // Capitalizar primera letra
        capitalizeFirst(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },

        // Manejar error de imagen
        handleImageError(event) {
            if (!this.pokemon) return
            event.target.src = `https://via.placeholder.com/160x160/cccccc/666666?text=${this.pokemon.name.charAt(0).toUpperCase()}`
        },

        // Cargar detalles del Pokémon
        async loadPokemonDetails() {
            if (!this.pokemon || this.isLoadingDetails) return

            this.isLoadingDetails = true
            try {
                this.pokemonDetails = await this.fetchPokemonDetails(this.pokemon.name)
            } catch (error) {
                console.error('Error loading pokemon details:', error)
            } finally {
                this.isLoadingDetails = false
            }
        }
    },

    watch: {
        // Cargar detalles cuando se abre el modal
        isVisible(newVal) {
            if (newVal && this.pokemon) {
                // Guardar estado inicial para saber si ya era favorito
                this.wasAlreadyFavorite = this.isFavorite
                this.loadPokemonDetails()
            }
        },

        // Cargar detalles cuando cambia el Pokémon
        pokemon(newVal) {
            if (newVal && this.isVisible) {
                this.wasAlreadyFavorite = this.isFavorite
                this.loadPokemonDetails()
            }
        }
    }
}
</script>

<style scoped>
/* Animaciones para el modal */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Asegurar que el modal esté encima de todo */
.modal-overlay {
    z-index: 10000 !important;
}

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

/* Pokeball en esquina - círculo perfecto */
.pokeball-corner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pokeball-corner .pokeball-container {
    width: 30px !important;
    height: 30px !important;
}

.pokeball-corner .pokeball {
    width: 30px !important;
    height: 30px !important;
    border-radius: 50% !important;
}

.pokeball-corner .pokeball-top {
    border-radius: 15px 15px 0 0 !important;
}

.pokeball-corner .pokeball-bottom {
    border-radius: 0 0 15px 15px !important;
}

/* Pokeball mediana de captura - círculo perfecto */
.pokeball-capture-medium {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pokeball-capture-medium .pokeball-container {
    width: 80px !important;
    height: 80px !important;
}

.pokeball-capture-medium .pokeball {
    width: 80px !important;
    height: 80px !important;
    border-radius: 50% !important;
}

.pokeball-capture-medium .pokeball-top {
    border-radius: 40px 40px 0 0 !important;
}

.pokeball-capture-medium .pokeball-bottom {
    border-radius: 0 0 40px 40px !important;
}
</style>