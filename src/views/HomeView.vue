<script>
import { mapState, mapActions } from 'pinia'
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import PokemonList from '@/components/PokemonList.vue'
import FavoritePokemonList from '@/components/FavoritePokemonList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'HomeView',
  components: {
    PokemonList,
    FavoritePokemonList,
    LoadingSpinner
  },

  data() {
    return {
      activeTab: 'all' // 'all' o 'favorites'
    }
  },

  computed: {
    ...mapState(usePokemonStore, ['allPokemons', 'isLoading']),
    ...mapState(useFavoritesStore, ['favoritesCount'])
  },

  methods: {
    ...mapActions(usePokemonStore, ['fetchAllPokemons'])
  },

  // Cargar datos iniciales al crear el componente
  async created() {
    // Solo cargar si no hay pokemon ya cargados
    if (this.allPokemons.length === 0) {
      console.log('🚀 Iniciando carga de Pokémon...')
      await this.fetchAllPokemons()
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Spinner Global -->
    <LoadingSpinner v-if="isLoading" loading-text="Cargando Pokédex..." />

    <!-- Header Principal -->
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mb-8">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-4">
          🔥 PokéGlobal66
        </h1>
        <p class="text-xl text-blue-100 mb-6">
          Descubre, colecciona y comparte tus Pokémon favoritos
        </p>

        <!-- Estadísticas principales -->
        <div class="flex flex-wrap justify-center gap-6 mt-8">
          <div class="bg-white bg-opacity-20 rounded-lg px-6 py-3">
            <div class="text-2xl font-bold">{{ allPokemons.length }}</div>
            <div class="text-sm">Pokémon Disponibles</div>
          </div>
          <div class="bg-white bg-opacity-20 rounded-lg px-6 py-3">
            <div class="text-2xl font-bold">{{ favoritesCount }}</div>
            <div class="text-sm">Favoritos</div>
          </div>
          <div class="bg-white bg-opacity-20 rounded-lg px-6 py-3">
            <div class="text-2xl font-bold">Gen I</div>
            <div class="text-sm">Kanto</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="container mx-auto px-4 pb-8">
      <!-- Navegación entre secciones -->
      <div class="mb-8">
        <nav class="bg-white rounded-lg shadow-md p-2 flex gap-2">
          <button @click="activeTab = 'all'" :class="[
            activeTab === 'all'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100',
            'flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2'
          ]">
            🌟 Todos los Pokémon
            <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {{ allPokemons.length }}
            </span>
          </button>

          <button @click="activeTab = 'favorites'" :class="[
            activeTab === 'favorites'
              ? 'bg-red-500 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100',
            'flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2'
          ]">
            ❤️ Favoritos
            <span v-if="favoritesCount > 0" class="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {{ favoritesCount }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Sección de Pokémon -->
      <section>
        <!-- Vista de todos los Pokémon -->
        <div v-if="activeTab === 'all'">
          <PokemonList />
        </div>

        <!-- Vista de favoritos -->
        <div v-if="activeTab === 'favorites'">
          <FavoritePokemonList />
        </div>
      </section>

      <!-- Tips y consejos -->
      <aside class="mt-12 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg p-6">
        <h3 class="text-2xl font-bold mb-4">💡 ¿Sabías que...?</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-start gap-3">
            <span class="text-xl">❤️</span>
            <div>
              <strong>Favoritos:</strong> Haz clic en el botón "❤️ Favorito" para guardar tus Pokémon preferidos y
              acceder a ellos rápidamente.
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xl">📤</span>
            <div>
              <strong>Compartir:</strong> Usa el botón "📤" para compartir información detallada de cualquier Pokémon
              con tus amigos.
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xl">🔍</span>
            <div>
              <strong>Búsqueda:</strong> Utiliza el buscador para encontrar rápidamente cualquier Pokémon por su nombre.
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xl">🏷️</span>
            <div>
              <strong>Tipos:</strong> Los colores de las etiquetas representan los diferentes tipos de Pokémon (Fuego,
              Agua, Planta, etc.).
            </div>
          </div>
        </div>
      </aside>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
      <div class="container mx-auto px-4 text-center">
        <div class="mb-4">
          <h4 class="text-xl font-bold mb-2">🔥 PokéGlobal66</h4>
          <p class="text-gray-400">Tu compañero definitivo para explorar el mundo Pokémon</p>
        </div>

        <div class="border-t border-gray-700 pt-4 text-sm text-gray-400">
          <p>Desarrollado con ❤️ usando Vue 3, Vite, Tailwind CSS, Pinia y Vitest</p>
          <p class="mt-2">Datos proporcionados por <a href="https://pokeapi.co"
              class="text-blue-400 hover:text-blue-300" target="_blank">PokéAPI</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Animaciones personalizadas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Efecto hover para las cards */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
</style>
