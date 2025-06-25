<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
        <div class="text-center">
            <!-- Animación de Pokeball personalizada -->
            <div class="relative w-20 h-20 mx-auto mb-4">
                <div class="pokeball-container animate-bounce">
                    <div class="pokeball-top bg-red-500"></div>
                    <div class="pokeball-bottom bg-white"></div>
                    <div class="pokeball-middle bg-gray-800"></div>
                    <div class="pokeball-button bg-white"></div>
                </div>
            </div>

            <!-- Texto de carga -->
            <p class="text-white text-xl font-semibold animate-pulse">
                {{ loadingText }}
            </p>

            <!-- Puntos animados -->
            <div class="flex justify-center mt-2 space-x-1">
                <div class="w-2 h-2 bg-white rounded-full animate-ping" style="animation-delay: 0s"></div>
                <div class="w-2 h-2 bg-white rounded-full animate-ping" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-white rounded-full animate-ping" style="animation-delay: 0.4s"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingSpinner',
    props: {
        loadingText: {
            type: String,
            default: 'Cargando Pokémon...'
        }
    }
}
</script>

<style scoped>
/* Estilos personalizados para la Pokeball */
.pokeball-container {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #2d3748;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.pokeball-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    border-radius: 80px 80px 0 0;
}

.pokeball-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    border-radius: 0 0 80px 80px;
    border: 2px solid #e2e8f0;
}

.pokeball-middle {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 6px;
    transform: translateY(-50%);
}

.pokeball-button {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border: 3px solid #2d3748;
    box-shadow: inset 0 0 0 3px #e2e8f0;
}

/* Animación de rotación para la pokeball */
.pokeball-container {
    animation: pokeball-spin 2s linear infinite;
}

@keyframes pokeball-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>