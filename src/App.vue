<template>
  <div id="app" class="min-h-screen bg-gray-50 overflow-hidden">
    <!-- Contenedor de transiciones que previene scroll horizontal -->
    <div class="transition-container">
      <!-- Contenido principal con transiciones -->
      <router-view v-slot="{ Component, route }">
        <transition :name="getTransitionName(route)" mode="out-in" @enter="onEnter" @leave="onLeave">
          <component :is="Component" :key="route.path" class="page-component" />
        </transition>
      </router-view>
    </div>

    <!-- Indicador de estado de red (opcional) -->
    <div v-if="!isOnline && showNavbar"
      class="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
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
    ...mapState(useFavoritesStore, ['favoritesCount']),

    // Determinar si mostrar la navbar basado en la ruta actual
    showNavbar() {
      const hiddenRoutes = ['welcome', 'loading']
      return !hiddenRoutes.includes(this.$route.name)
    }
  },

  methods: {
    // Manejar cambios en el estado de conexión
    handleOnlineStatus() {
      this.isOnline = navigator.onLine
    },

    // Cerrar menú móvil al cambiar de ruta
    closeMenu() {
      this.mobileMenuOpen = false
    },

    // Determinar el nombre de la transición según la ruta
    getTransitionName(route) {
      const routeName = route.name
      const previousRoute = this.$route?.name

      // Detectar si vamos hacia atrás en el flujo
      const isGoingBack = (
        (previousRoute === 'home' && routeName === 'empty-list') ||
        (previousRoute === 'empty-list' && routeName === 'loading') ||
        (previousRoute === 'loading' && routeName === 'welcome')
      )

      // Transiciones específicas según el flujo
      if (routeName === 'welcome') {
        return isGoingBack ? 'slide-right' : 'fade'
      } else if (routeName === 'loading') {
        return isGoingBack ? 'slide-right' : 'slide-left'
      } else if (routeName === 'empty-list') {
        return isGoingBack ? 'slide-down' : 'slide-left'
      } else if (routeName === 'home') {
        return 'slide-up' // Siempre hacia arriba para lista completa
      }

      return 'fade' // Transición por defecto
    },

    // Callbacks para las transiciones
    onEnter(el) {
      // Scroll al top al entrar a una nueva página
      window.scrollTo(0, 0)
    },

    onLeave(el) {
      // Lógica adicional al salir de una página si es necesario
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
html,
body {
  overflow-x: hidden;
  /* Previene scroll horizontal globalmente */
  width: 100%;
  height: 100%;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  width: 100%;
  max-width: 100vw;
  /* Limita el ancho máximo */
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

/* ===== CONTENEDOR DE TRANSICIONES ===== */
.transition-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  /* Previene scroll horizontal */
}

.page-component {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  /* Solo scroll vertical en cada página */
}

/* ===== TRANSICIONES DE PÁGINA ===== */

/* Transición fade (suave) */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Transición slide-left (progreso hacia adelante) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.98);
  clip-path: inset(0 0 0 30px);
  /* Evita overflow */
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(1.02);
  clip-path: inset(0 20px 0 0);
  /* Evita overflow */
}

/* Transición slide-up (elevación) */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.02);
}

/* Transición slide-right (retroceso) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.98);
  clip-path: inset(0 30px 0 0);
  /* Evita overflow */
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(1.02);
  clip-path: inset(0 0 0 20px);
  /* Evita overflow */
}

/* Transición slide-down (descenso) */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0.98);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(1.02);
}

/* Animación especial para loading */
.slide-left-enter-active.loading-route {
  animation: pulseIn 0.6s ease-out;
}

@keyframes pulseIn {
  0% {
    opacity: 0;
    transform: scale(0.9) translateX(30px);
  }

  50% {
    transform: scale(1.02) translateX(0);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

/* Mejoras adicionales para transiciones */
.router-view-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Transición mejorada para dispositivos móviles */
@media (max-width: 768px) {

  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-up-enter-active,
  .slide-up-leave-active,
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition-duration: 0.4s;
    /* Más rápido en móviles */
  }

  .slide-left-enter-from,
  .slide-right-enter-from {
    transform: translateX(15px) scale(0.99);
    /* Movimiento más sutil y seguro */
    clip-path: inset(0 0 0 15px);
    /* Previene overflow en móviles */
  }

  .slide-up-enter-from,
  .slide-down-enter-from {
    transform: translateY(15px) scale(0.99);
    /* Movimiento más sutil */
  }
}

/* Optimización para dispositivos de bajo rendimiento */
@media (prefers-reduced-motion: reduce) {

  .fade-enter-active,
  .fade-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-up-enter-active,
  .slide-up-leave-active,
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition-duration: 0.2s;
    /* Transiciones muy rápidas */
  }

  .slide-left-enter-from,
  .slide-right-enter-from,
  .slide-up-enter-from,
  .slide-down-enter-from {
    transform: none;
    /* Sin transformaciones, solo fade */
  }
}
</style>
