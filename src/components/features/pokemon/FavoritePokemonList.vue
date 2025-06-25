<template>
    <div class="w-full">
        <!-- Header de favoritos -->
        <div class="mb-8 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-lg p-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 class="text-3xl font-bold mb-2">
                        ❤️ Mis Pokémon Favoritos
                    </h2>
                    <p class="text-red-100">
                        Tu colección personal de Pokémon especiales
                    </p>
                </div>

                <!-- Estadísticas de favoritos -->
                <div class="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold">{{ favoritePokemons.length }}</div>
                    <div class="text-sm">Favoritos</div>
                </div>
            </div>

            <!-- Acciones rápidas -->
            <div class="mt-4 flex flex-wrap gap-3">
                <button v-if="favoritePokemons.length > 0" @click="shareAllFavorites"
                    class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2">
                    📤 Compartir Todos
                </button>

                <button v-if="favoritePokemons.length > 1" @click="showConfirmClearAll = true"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2">
                    🗑️ Limpiar Todos
                </button>

                <button @click="sortFavorites"
                    class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2">
                    🔄 {{ sortOrder === 'asc' ? 'Z-A' : 'A-Z' }}
                </button>
            </div>
        </div>

        <!-- Lista de favoritos -->
        <div v-if="sortedFavorites.length > 0">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <div v-for="pokemon in sortedFavorites" :key="pokemon.name" class="relative">
                    <!-- Badge especial para favoritos -->
                    <div
                        class="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-xs font-bold z-10 shadow-lg">
                        ⭐ FAVORITO
                    </div>

                    <!-- Card mejorada para favoritos -->
                    <div
                        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-red-200 hover:border-red-300">
                        <!-- Imagen del Pokemon -->
                        <div class="relative mb-4">
                            <img :src="getPokemonImageUrl(pokemon)" :alt="pokemon.name"
                                class="w-32 h-32 object-contain mx-auto transition-transform duration-300 hover:scale-110"
                                @error="(e) => handleImageError(e, pokemon)" />
                        </div>

                        <!-- Información del Pokemon -->
                        <div class="text-center mb-4">
                            <h3 class="text-xl font-bold text-gray-800 capitalize mb-2">
                                {{ pokemon.name }}
                            </h3>

                            <p class="text-sm text-gray-500 mb-2">
                                #{{ pokemon.id }}
                            </p>

                            <!-- Tipos -->
                            <div class="flex justify-center gap-2 mb-3">
                                <span v-for="type in pokemon.types" :key="type.type.name"
                                    :class="getTypeColor(type.type.name)"
                                    class="px-2 py-1 rounded-full text-xs font-semibold text-white">
                                    {{ type.type.name }}
                                </span>
                            </div>
                        </div>

                        <!-- Información detallada -->
                        <div class="bg-gray-50 rounded-lg p-3 mb-4">
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <div class="text-center">
                                    <p class="font-semibold text-gray-700">Altura</p>
                                    <p class="text-gray-600">{{ (pokemon.height / 10).toFixed(1) }}m</p>
                                </div>
                                <div class="text-center">
                                    <p class="font-semibold text-gray-700">Peso</p>
                                    <p class="text-gray-600">{{ (pokemon.weight / 10).toFixed(1) }}kg</p>
                                </div>
                            </div>
                        </div>

                        <!-- Habilidades -->
                        <div class="mb-4">
                            <p class="text-sm font-semibold text-gray-700 mb-2">⚡ Habilidades:</p>
                            <div class="flex flex-wrap gap-1">
                                <span v-for="ability in pokemon.abilities" :key="ability.ability.name"
                                    class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {{ ability.ability.name }}
                                </span>
                            </div>
                        </div>

                        <!-- Botones de acción -->
                        <div class="flex gap-2">
                            <button @click="removeFavorite(pokemon.name)"
                                class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm">
                                💔 Quitar
                            </button>

                            <button @click="shareSinglePokemon(pokemon)"
                                class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition-colors"
                                :title="`Compartir ${pokemon.name}`">
                                📤
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estado vacío -->
        <div v-else class="text-center py-16">
            <div class="text-8xl mb-6">💔</div>
            <h3 class="text-2xl font-semibold text-gray-700 mb-4">
                No tienes Pokémon favoritos aún
            </h3>
            <p class="text-gray-500 mb-6">
                Explora la lista de Pokémon y marca los que más te gusten como favoritos
            </p>
            <router-link to="/"
                class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
                🌟 Explorar Pokémon
            </router-link>
        </div>

        <!-- Modal de confirmación para limpiar todos -->
        <div v-if="showConfirmClearAll"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="showConfirmClearAll = false">
            <div class="bg-white rounded-lg p-6 m-4 max-w-md w-full" @click.stop>
                <h3 class="text-xl font-bold text-gray-800 mb-4">
                    🗑️ Confirmar eliminación
                </h3>
                <p class="text-gray-600 mb-6">
                    ¿Estás seguro de que quieres eliminar todos tus Pokémon favoritos? Esta acción no se puede deshacer.
                </p>
                <div class="flex gap-3">
                    <button @click="showConfirmClearAll = false"
                        class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button @click="confirmClearAll"
                        class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                        Eliminar Todos
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'

export default {
    name: 'FavoritePokemonList',

    data() {
        return {
            sortOrder: 'asc', // 'asc' o 'desc'
            showConfirmClearAll: false
        }
    },

    computed: {
        ...mapState(useFavoritesStore, ['favoritePokemons']),

        // Pokemon favoritos ordenados
        sortedFavorites() {
            const sorted = [...this.favoritePokemons].sort((a, b) => {
                if (this.sortOrder === 'asc') {
                    return a.name.localeCompare(b.name)
                } else {
                    return b.name.localeCompare(a.name)
                }
            })
            return sorted
        }
    },

    methods: {
        ...mapActions(useFavoritesStore, ['removeFavorite', 'clearAllFavorites']),

        // Alternar orden de clasificación
        sortFavorites() {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
        },

        // Confirmar limpiar todos los favoritos
        confirmClearAll() {
            this.clearAllFavorites()
            this.showConfirmClearAll = false
        },

        // Compartir todos los favoritos
        async shareAllFavorites() {
            try {
                const pokemonNames = this.favoritePokemons.map(p =>
                    p.name.charAt(0).toUpperCase() + p.name.slice(1)
                ).join(', ')

                const shareText = `🔥 ¡Mira mi colección de Pokémon favoritos! 
❤️ Mis ${this.favoritePokemons.length} favoritos: ${pokemonNames}
#Pokemon #PokeGlobal66 #MisPokemons`

                if (navigator.share) {
                    await navigator.share({
                        title: 'Mis Pokémon Favoritos',
                        text: shareText
                    })
                } else {
                    await navigator.clipboard.writeText(shareText)
                    this.showNotification('✅ ¡Lista de favoritos copiada al portapapeles!')
                }
            } catch (error) {
                console.error('❌ Error al compartir favoritos:', error)
                this.fallbackShareAll()
            }
        },

        // Compartir un Pokemon individual
        async shareSinglePokemon(pokemon) {
            try {
                const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
                const types = pokemon.types?.map(t => t.type.name).join(', ') || 'Desconocido'
                const abilities = pokemon.abilities?.map(a => a.ability.name).join(', ') || 'Desconocidas'

                const shareText = `🔥 ¡${name} es uno de mis Pokémon favoritos!
🎯 Tipos: ${types}
⚡ Habilidades: ${abilities}
📏 Altura: ${(pokemon.height / 10).toFixed(1)}m
⚖️ Peso: ${(pokemon.weight / 10).toFixed(1)}kg
#Pokemon #PokeGlobal66`

                if (navigator.share) {
                    await navigator.share({
                        title: `Mi Pokémon Favorito: ${name}`,
                        text: shareText
                    })
                } else {
                    await navigator.clipboard.writeText(shareText)
                    this.showNotification(`✅ Información de ${name} copiada al portapapeles!`)
                }
            } catch (error) {
                console.error('❌ Error al compartir pokemon:', error)
            }
        },

        // Fallback para compartir todos
        fallbackShareAll() {
            const pokemonNames = this.favoritePokemons.map(p =>
                p.name.charAt(0).toUpperCase() + p.name.slice(1)
            ).join(', ')

            const shareText = `🔥 ¡Mira mi colección de Pokémon favoritos! 
❤️ Mis ${this.favoritePokemons.length} favoritos: ${pokemonNames}
#Pokemon #PokeGlobal66 #MisPokemons`

            prompt('Copia esta información para compartir:', shareText)
        },

        // Obtener URL de imagen del Pokemon
        getPokemonImageUrl(pokemon) {
            return pokemon.sprites?.other?.['official-artwork']?.front_default ||
                pokemon.sprites?.front_default ||
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
        },

        // Manejar error de imagen
        handleImageError(event, pokemon) {
            event.target.src = `https://via.placeholder.com/150x150/cccccc/666666?text=${pokemon.name}`
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

        // Mostrar notificación
        showNotification(message) {
            const notification = document.createElement('div')
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300'
            notification.textContent = message

            document.body.appendChild(notification)

            setTimeout(() => {
                notification.style.opacity = '0'
                setTimeout(() => document.body.removeChild(notification), 300)
            }, 3000)
        }
    }
}
</script>