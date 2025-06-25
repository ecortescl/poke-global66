<script>
import { mapState, mapActions } from 'pinia'
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import { PokemonList, FavoritePokemonList } from '@/components/features/pokemon'
import { LoadingSpinner } from '@/components/ui'
import { BottomNavigation } from '@/components/layout'

export default {
  name: 'HomeView',
  components: {
    PokemonList,
    FavoritePokemonList,
    LoadingSpinner,
    BottomNavigation
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
    ...mapActions(usePokemonStore, ['fetchAllPokemons']),

    // Manejar cambio de tab
    handleTabChange(tabName) {
      this.activeTab = tabName
    }
  },

  // Cargar datos iniciales al crear el componente
  async created() {
    try {
      // Solo cargar si no hay pokemon ya cargados
      if (this.allPokemons.length === 0) {
        console.log('🚀 Iniciando carga de Pokémon...')
        await this.fetchAllPokemons()
      }
    } catch (error) {
      console.error('❌ Error al cargar Pokémon:', error)
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Spinner Global -->
    <LoadingSpinner v-if="isLoading" loading-text="Cargando Pokédex..." />

    <!-- Contenido Principal -->
    <main class="pb-20">
      <!-- Vista de todos los Pokémon -->
      <div v-if="activeTab === 'all'">
        <PokemonList />
      </div>

      <!-- Vista de favoritos -->
      <div v-if="activeTab === 'favorites'">
        <FavoritePokemonList />
      </div>
    </main>

    <!-- Navegación inferior -->
    <BottomNavigation :activeTab="activeTab" @tab-change="handleTabChange" />
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
