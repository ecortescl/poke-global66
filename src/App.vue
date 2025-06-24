<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navbar Principal -->
    <nav class="bg-white shadow-lg sticky top-0 z-40">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <!-- Logo -->
          <router-link to="/"
            class="flex items-center gap-3 text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            <span class="text-3xl">⚡</span>
            PokéGlobal66
          </router-link>

          <!-- Navegación -->
          <div class="hidden md:flex items-center gap-6">
            <router-link to="/" class="nav-link" :class="{ 'active': $route.name === 'home' }">
              🏠 Inicio
            </router-link>

            <!-- Contador de favoritos en la navbar -->
            <div v-if="favoritesCount > 0"
              class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
              ❤️ {{ favoritesCount }} Favoritos
            </div>
          </div>

          <!-- Menú móvil -->
          <button @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none">
            <span class="text-2xl">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
          </button>
        </div>

        <!-- Menú móvil expandido -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-4">
          <router-link to="/" @click="mobileMenuOpen = false"
            class="block py-2 text-gray-700 hover:text-blue-600 font-medium"
            :class="{ 'text-blue-600 font-bold': $route.name === 'home' }">
            🏠 Inicio
          </router-link>

          <div v-if="favoritesCount > 0"
            class="mt-2 bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2">
            ❤️ {{ favoritesCount }} Favoritos
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <router-view />

    <!-- Indicador de estado de red (opcional) -->
    <div v-if="!isOnline" class="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      📡 Sin conexión a internet
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'

export default {
  name: 'App',

  data() {
    return {
      mobileMenuOpen: false,
      isOnline: navigator.onLine
    }
  },

  computed: {
    ...mapState(useFavoritesStore, ['favoritesCount'])
  },

  methods: {
    // Manejar cambios en el estado de conexión
    handleOnlineStatus() {
      this.isOnline = navigator.onLine
    },

    // Cerrar menú móvil al cambiar de ruta
    closeMenu() {
      this.mobileMenuOpen = false
    }
  },

  mounted() {
    // Escuchar eventos de conexión
    window.addEventListener('online', this.handleOnlineStatus)
    window.addEventListener('offline', this.handleOnlineStatus)

    // Cerrar menú móvil al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('nav') && this.mobileMenuOpen) {
        this.mobileMenuOpen = false
      }
    })
  },

  beforeUnmount() {
    // Limpiar event listeners
    window.removeEventListener('online', this.handleOnlineStatus)
    window.removeEventListener('offline', this.handleOnlineStatus)
  },

  watch: {
    // Cerrar menú móvil cuando cambie la ruta
    '$route'() {
      this.closeMenu()
    }
  }
}
</script>

<style scoped>
/* Estilos para la navegación */
.nav-link {
  @apply px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200;
}

.nav-link.active {
  @apply text-blue-600 bg-blue-50 font-semibold;
}

/* Animación para el menú móvil */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Estilos globales */
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scroll suave */
html {
  scroll-behavior: smooth;
}

/* Personalizar scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
