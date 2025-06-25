<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <!-- Contenedor principal -->
        <div class="p-8 text-center">
            <!-- Pokeball SVG Animada -->
            <div class="mb-8">
                <PokeBallLoader :size="150" :state="pokeBallState" @animation-iteration="handleAnimationIteration" />
            </div>

            <!-- Texto de carga -->
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
                Cargando Pokédex...
            </h2>

            <!-- Barra de progreso -->
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div class="bg-red-500 h-2 rounded-full transition-all duration-100 ease-linear"
                    :style="{ width: progress + '%' }"></div>
            </div>

            <!-- Porcentaje -->
            <p class="text-gray-600 text-lg">
                {{ Math.round(progress) }}%
            </p>
        </div>
    </div>
</template>

<script>
import PokeBallLoader from '../components/PokeBallLoader.vue'

export default {
    name: 'LoadingView',

    components: {
        PokeBallLoader
    },

    data() {
        return {
            progress: 0,
            timer: null,
            pokeBallState: 'fetching'
        }
    },

    mounted() {
        this.startLoading()
    },

    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    },

    methods: {
        startLoading() {
            const duration = 5000 // 5 segundos
            const interval = 50 // Actualizar cada 50ms
            const increment = (100 / duration) * interval

            this.timer = setInterval(() => {
                this.progress += increment

                if (this.progress >= 100) {
                    this.progress = 100
                    this.pokeBallState = 'success'
                    clearInterval(this.timer)

                    // Pequeño delay para mostrar la animación de éxito antes de navegar
                    setTimeout(() => {
                        this.$router.push('/empty-list')
                    }, 800)
                }
            }, interval)
        },

        handleAnimationIteration() {
            // Este método se ejecutará en cada iteración de la animación
            // Puedes agregar lógica adicional aquí si es necesario
        }
    }
}
</script>

<style scoped>
/* Estilos específicos para LoadingView si los necesitas */
</style>