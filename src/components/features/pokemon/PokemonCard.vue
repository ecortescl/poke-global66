<template>
    <div
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 m-3 flex flex-col items-center transform hover:scale-105">
        <!-- Imagen del Pokemon -->
        <div class="relative mb-4">
            <img :src="pokemonImageUrl" :alt="pokemon.name"
                class="w-32 h-32 object-contain transition-transform duration-300 hover:scale-110"
                @error="handleImageError" :class="{ 'animate-pulse': imageLoading }" />

            <!-- Badge de favorito flotante -->
            <div v-if="isFavorite"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                ❤️
            </div>
        </div>

        <!-- Información básica del Pokemon -->
        <div class="text-center mb-4 w-full">
            <h3 class="text-2xl font-bold text-gray-800 capitalize mb-2">
                {{ pokemon.name }}
            </h3>

            <!-- ID del Pokemon -->
            <p class="text-sm text-gray-500 mb-2">
                #{{ pokemonId }}
            </p>

            <!-- Tipos del Pokemon (si están disponibles) -->
            <div v-if="pokemonDetails?.types" class="flex justify-center gap-2 mb-3">
                <span v-for="type in pokemonDetails.types" :key="type.type.name" :class="getTypeColor(type.type.name)"
                    class="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm">
                    {{ type.type.name }}
                </span>
            </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-3 w-full">
            <!-- Botón de favorito -->
            <button @click="handleToggleFavorite" :disabled="isProcessingFavorite" :class="[
                isFavorite
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white',
                'flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            ]">
                <span v-if="!isProcessingFavorite">
                    {{ isFavorite ? '💔 Quitar' : '❤️ Favorito' }}
                </span>
                <span v-else class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2">
                    </div>
                    Procesando...
                </span>
            </button>

            <!-- Botón de compartir -->
            <button @click="handleShare"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
                :title="`Compartir información de ${pokemon.name}`">
                📤
            </button>
        </div>

        <!-- Información adicional (si está disponible) -->
        <div v-if="pokemonDetails" class="w-full mt-4 pt-4 border-t border-gray-200">
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div class="text-center">
                    <p class="font-semibold">Altura</p>
                    <p>{{ (pokemonDetails.height / 10).toFixed(1) }}m</p>
                </div>
                <div class="text-center">
                    <p class="font-semibold">Peso</p>
                    <p>{{ (pokemonDetails.weight / 10).toFixed(1) }}kg</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'
import { usePokemonStore } from '@/stores/pokemon'

export default {
    name: 'PokemonCard',
    props: {
        pokemon: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            pokemonDetails: null,
            imageLoading: false,
            hasImageError: false
        }
    },

    computed: {
        ...mapState(useFavoritesStore, ['isProcessingFavorite']),

        // Verificar si este Pokemon está en favoritos
        isFavorite() {
            const favoritesStore = useFavoritesStore()
            return favoritesStore.isPokemonFavorite(this.pokemon.name)
        },

        // Obtener el ID del Pokemon desde la URL
        pokemonId() {
            if (this.pokemon.url) {
                const urlParts = this.pokemon.url.split('/')
                return urlParts[urlParts.length - 2]
            }
            return this.pokemonDetails?.id || '???'
        },

        // Generar URL de imagen del Pokemon
        pokemonImageUrl() {
            if (this.hasImageError) {
                return `https://via.placeholder.com/150x150/cccccc/666666?text=${this.pokemon.name}`
            }

            const id = this.pokemonId
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        }
    },

    methods: {
        ...mapActions(useFavoritesStore, ['toggleFavorite']),
        ...mapActions(usePokemonStore, ['fetchPokemonDetails']),

        // Manejar toggle de favorito
        async handleToggleFavorite() {
            try {
                await this.toggleFavorite(this.pokemon.name)

                // Si no tenemos detalles y se agregó a favoritos, los obtenemos
                if (!this.pokemonDetails && this.isFavorite) {
                    await this.loadPokemonDetails()
                }
            } catch (error) {
                console.error('❌ Error al cambiar estado de favorito:', error)
            }
        },

        // Manejar compartir información del Pokemon
        async handleShare() {
            try {
                // Asegurar que tenemos los detalles completos
                if (!this.pokemonDetails) {
                    await this.loadPokemonDetails()
                }

                const shareInfo = this.generateShareText()

                // Intentar usar la API nativa de Share si está disponible
                if (navigator.share) {
                    await navigator.share({
                        title: `Pokemon: ${this.pokemon.name}`,
                        text: shareInfo
                    })
                } else {
                    // Fallback: copiar al portapapeles
                    await navigator.clipboard.writeText(shareInfo)
                    this.showShareConfirmation()
                }
            } catch (error) {
                console.error('❌ Error al compartir:', error)
                // Fallback manual
                this.fallbackShare()
            }
        },

        // Cargar detalles del Pokemon
        async loadPokemonDetails() {
            try {
                this.pokemonDetails = await this.fetchPokemonDetails(this.pokemon.name)
            } catch (error) {
                console.error(`❌ Error cargando detalles de ${this.pokemon.name}:`, error)
            }
        },

        // Generar texto para compartir
        generateShareText() {
            const name = this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1)

            if (this.pokemonDetails) {
                const types = this.pokemonDetails.types?.map(t => t.type.name).join(', ') || 'Desconocido'
                const abilities = this.pokemonDetails.abilities?.map(a => a.ability.name).join(', ') || 'Desconocidas'

                return `🔥 ¡Mira este increíble Pokémon!
📛 Nombre: ${name}
🎯 Tipos: ${types}
⚡ Habilidades: ${abilities}
📏 Altura: ${(this.pokemonDetails.height / 10).toFixed(1)}m
⚖️ Peso: ${(this.pokemonDetails.weight / 10).toFixed(1)}kg
#Pokemon #PokeGlobal66`
            }

            return `🔥 ¡Descubre a ${name}!
¡Un increíble Pokémon esperando ser explorado!
#Pokemon #PokeGlobal66`
        },

        // Mostrar confirmación de compartir
        showShareConfirmation() {
            // Crear notificación temporal
            const notification = document.createElement('div')
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300'
            notification.textContent = '✅ ¡Información copiada al portapapeles!'

            document.body.appendChild(notification)

            setTimeout(() => {
                notification.style.opacity = '0'
                setTimeout(() => document.body.removeChild(notification), 300)
            }, 3000)
        },

        // Fallback para compartir manualmente
        fallbackShare() {
            const shareText = this.generateShareText()
            prompt('Copia esta información para compartir:', shareText)
        },

        // Obtener color del tipo de Pokemon
        getTypeColor(type) {
            const typeColors = {
                normal: 'bg-gray-400',
                fire: 'bg-red-500',
                water: 'bg-blue-500',
                electric: 'bg-yellow-400',
                grass: 'bg-green-500',
                ice: 'bg-blue-300',
                fighting: 'bg-red-700',
                poison: 'bg-purple-500',
                ground: 'bg-yellow-600',
                flying: 'bg-indigo-400',
                psychic: 'bg-pink-500',
                bug: 'bg-green-400',
                rock: 'bg-yellow-800',
                ghost: 'bg-purple-700',
                dragon: 'bg-indigo-700',
                dark: 'bg-gray-800',
                steel: 'bg-gray-500',
                fairy: 'bg-pink-300'
            }

            return typeColors[type] || 'bg-gray-400'
        },

        // Manejar error de imagen
        handleImageError() {
            this.hasImageError = true
        }
    },

    // Cargar detalles cuando se monta el componente
    async mounted() {
        await this.loadPokemonDetails()
    }
}
</script>