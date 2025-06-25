<template>
    <div class="min-h-screen  flex flex-col items-center justify-center p-4">
        <!-- Contenedor principal -->
        <div class="w-full p-8 text-center">
            <!-- Logo de Pikachu con círculo rojo -->
            <div class="mb-8 relative">

                <!-- Pikachu encima del círculo -->
                <div class="relative z-10">
                    <img src="/pikaHome.svg" alt="Pikachu Welcome" class="h-64 mx-auto">
                </div>
            </div>

            <!-- Título -->
            <h1 class="text-4xl font-bold text-gray-800 mb-4">
                Welcome to Pokédex
            </h1>

            <!-- Descripción -->
            <p class="text-gray-600 text-lg mb-8 leading-relaxed">
                The digital encyclopedia created by Professor Oak is an invaluable tool<br>
                to Trainers in the Pokémon world.
            </p>

            <!-- Botón Get Started -->
            <button @click="handleGetStarted"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get started
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WelcomeView',

    methods: {
        handleGetStarted() {
            // Navegar a la vista de loading
            this.$router.push('/loading')
        }
    }
}
</script>

<style scoped>
/* Animaciones adicionales */
.bg-white {
    animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

button:active {
    transform: scale(0.95);
}
</style>