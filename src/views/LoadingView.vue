<template>
    <div class="min-h-screen  flex flex-col items-center justify-center p-4">
        <!-- Contenedor principal -->
        <div class=" p-8 text-center">
            <!-- Logo de Pokéball -->
            <div class="mb-8">
                <img src="/Loading.png" alt="Loading" class="w-48 h-48 mx-auto object-contain animate-bounce">
            </div>

            <!-- Texto de carga -->
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
                Loading Pokédex...
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
export default {
    name: 'LoadingView',

    data() {
        return {
            progress: 0,
            timer: null
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
            const duration = 50000 // 5 segundos
            const interval = 50 // Actualizar cada 50ms
            const increment = (100 / duration) * interval

            this.timer = setInterval(() => {
                this.progress += increment

                if (this.progress >= 100) {
                    this.progress = 100
                    clearInterval(this.timer)

                    // Pequeño delay para mostrar el 100% antes de navegar
                    setTimeout(() => {
                        this.$router.push('/home')
                    }, 200)
                }
            }, interval)
        }
    }
}
</script>

<style scoped>
/* Animación personalizada para el loading */
@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

.animate-bounce {
    animation: bounce 2s infinite;
}

@keyframes bounce {

    0%,
    20%,
    53%,
    80%,
    100% {
        transform: translateY(0);
    }

    40%,
    43% {
        transform: translateY(-10px);
    }

    70% {
        transform: translateY(-5px);
    }

    90% {
        transform: translateY(-2px);
    }
}
</style>