<template>
    <div class="pokeball-container" :class="containerClass">
        <div class="pokeball" :class="pokeballClass">
            <div class="pokeball-top"></div>
            <div class="pokeball-bottom"></div>
            <div class="pokeball-center">
                <div class="pokeball-button"></div>
            </div>
        </div>
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
            default: 40
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
        }
    }
}
</script>

<style scoped>
.pokeball-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
}

/* Pokeball base */
.pokeball {
    width: 40px;
    height: 40px;
    position: relative;
    border-radius: 50%;
}

/* Animaciones de estado */
.pokeball-capture {
    animation: capture 2s ease-in-out;
}

.pokeball-release {
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
        transform: translateX(-4px) scale(1);
    }

    40%,
    60%,
    80% {
        transform: translateX(4px) scale(1);
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

/* Partes de la pokeball */
.pokeball-top {
    width: 100%;
    height: 50%;
    background: linear-gradient(to bottom, #ff0000 0%, #dc143c 100%);
    border-radius: 40px 40px 0 0;
    position: relative;
}

.pokeball-bottom {
    width: 100%;
    height: 50%;
    background: linear-gradient(to top, #ffffff 0%, #f0f0f0 100%);
    border-radius: 0 0 40px 40px;
    position: relative;
}

.pokeball-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: #333;
    border-radius: 50%;
    border: 2px solid #fff;
    z-index: 10;
}

.pokeball-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    border: 1px solid #333;
}

/* Línea central de la pokeball */
.pokeball::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #333;
    z-index: 5;
}
</style>