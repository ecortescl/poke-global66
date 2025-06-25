<template>
    <div class="pokeball-container" :class="containerClass" :style="containerStyle">
        <!-- Efectos de luz para captura -->
        <div v-if="state === 'capturing'" class="capture-light-effects">
            <div class="light-ray light-ray-1"></div>
            <div class="light-ray light-ray-2"></div>
            <div class="light-ray light-ray-3"></div>
            <div class="light-ray light-ray-4"></div>
            <div class="capture-flash"></div>
        </div>

        <img src="/pokeball-clean.svg" alt="Pokeball" class="pokeball" :class="pokeballClass" :style="pokeballStyle" />
    </div>
</template>

<script>
export default {
    name: 'Pokeball',

    props: {
        // Estado de la pokeball: 'static', 'capturing', 'releasing'
        state: {
            type: String,
            default: 'static',
            validator: (value) => ['static', 'capturing', 'releasing'].includes(value)
        },

        // Tamaño de la pokeball
        size: {
            type: Number,
            default: 48
        }
    },

    computed: {
        containerClass() {
            return {
                'pokeball-capture': this.state === 'capturing',
                'pokeball-release': this.state === 'releasing',
                'pokeball-static': this.state === 'static'
            }
        },

        pokeballClass() {
            return {
                'animate-capturing': this.state === 'capturing',
                'animate-releasing': this.state === 'releasing'
            }
        },

        containerStyle() {
            return {
                width: `${this.size}px`,
                height: `${this.size}px`
            }
        },

        pokeballStyle() {
            return {
                width: `${this.size}px`,
                height: `${this.size}px`,
                maxWidth: '100%',
                maxHeight: '100%'
            }
        }
    }
}
</script>

<style scoped>
.pokeball-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: inherit;
    background: transparent;
}

/* Pokeball base */
.pokeball {
    width: 48px;
    height: 48px;
    object-fit: contain;
    position: relative;
    overflow: hidden;
    background: transparent;
}

/* Animaciones de estado */
.pokeball-capture {
    animation: capture 2s ease-in-out;
}

.pokeball-release {
    animation: release 1.5s ease-in-out;
}

.animate-capturing {
    animation: capture 2s ease-in-out;
}

.animate-releasing {
    animation: release 1.5s ease-in-out;
}

/* Keyframes para animaciones */
@keyframes capture {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    10% {
        transform: scale(1.2);
        opacity: 1;
    }

    20% {
        transform: scale(1);
        opacity: 1;
    }

    30%,
    50%,
    70%,
    90% {
        transform: translateX(-2px) scale(1);
    }

    40%,
    60%,
    80% {
        transform: translateX(2px) scale(1);
    }

    100% {
        transform: translateX(0) scale(1);
        opacity: 1;
    }
}

@keyframes release {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    20% {
        transform: scale(1.1);
        opacity: 1;
    }

    30%,
    50%,
    70% {
        transform: translateY(-2px) scale(1.1);
    }

    40%,
    60% {
        transform: translateY(2px) scale(1.1);
    }

    80% {
        transform: scale(1.3);
        opacity: 0.8;
    }

    100% {
        transform: scale(0);
        opacity: 0;
    }
}

/* Efectos de luz para captura */
.capture-light-effects {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
}

.light-ray {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    border-radius: 50%;
    animation: rotateRays 2s linear infinite;
}

.light-ray-1 {
    width: 100%;
    height: 2px;
    top: 50%;
    left: 0;
    transform-origin: center;
}

.light-ray-2 {
    width: 100%;
    height: 2px;
    top: 50%;
    left: 0;
    transform-origin: center;
    animation-delay: 0.5s;
}

.light-ray-3 {
    width: 2px;
    height: 100%;
    top: 0;
    left: 50%;
    transform-origin: center;
    animation-delay: 1s;
}

.light-ray-4 {
    width: 2px;
    height: 100%;
    top: 0;
    left: 50%;
    transform-origin: center;
    animation-delay: 1.5s;
}

.capture-flash {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    animation: captureFlash 2s ease-in-out infinite;
}

@keyframes rotateRays {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes captureFlash {

    0%,
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }

    50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
    }
}
</style>