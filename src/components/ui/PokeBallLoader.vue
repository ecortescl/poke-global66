<template>
    <svg ref="pokeball" viewBox="0 0 100 100" :width="size" :height="size" class="mx-auto" :class="animationClass">
        <!-- centrar y reducir escala -->
        <g transform="translate(50 50) scale(0.8)">
            <!-- estrellas posicionadas en la parte superior derecha/izquierda de la pokeball -->
            <g class="stars" transform="scale(0)">
                <path fill="#303030" stroke="#303030" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"
                    d="M -50 -50 l 4.5 0 l 2.5 -4.5 l 2.5 4.5 l 4.5 0 l -3.5 3.5 l 1.5 5 l -5 -2.5 l -5 2.5 l 1.5 -5 l -3.5 -3.5">
                </path>
                <path fill="#303030" stroke="#303030" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"
                    d="M 36 -50 l 4.5 0 l 2.5 -4.5 l 2.5 4.5 l 4.5 0 l -3.5 3.5 l 1.5 5 l -5 -2.5 l -5 2.5 l 1.5 -5 l -3.5 -3.5">
                </path>
            </g>
            <!-- grupo para mover el origen de transformación al fondo del svg -->
            <g transform="translate(0 50)">
                <g class="gravity">
                    <g transform="translate(0 -50)">
                        <!-- grupo que envuelve la pokeball en sí -->
                        <g class="ball" transform="scale(1 1)">
                            <g class="bottom">
                                <!-- semicírculo blanco -->
                                <path fill="#ffffff" stroke="#303030" stroke-width="5"
                                    d="M -47.5 0 a 47.5 47.5 0 0 0 95 0z"></path>
                            </g>
                            <g class="top">
                                <!-- semicírculo rojo, sin trazo -->
                                <path fill="#f15d5f" d="M -47.5 0 a 47.5 47.5 0 0 1 95 0"></path>
                                <!-- rayas blancas que forman el reflejo de la luz -->
                                <path fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"
                                    stroke-dasharray="0 15 9 9 20 100" d="M -38 -0 a 38 38 0 0 1 76 0"></path>
                                <!-- trazo para el semicírculo rojo -->
                                <path fill="none" stroke="#303030" stroke-width="5"
                                    d="M -47.5 0 a 47.5 47.5 0 0 1 95 0z"></path>
                            </g>

                            <!-- arcos posicionados entre las mitades superior e inferior -->
                            <g class="open" transform="scale(1 0)">
                                <path fill="#303030" stroke="#303030" stroke-width="5" stroke-linejoin="round"
                                    d="M -47.5 -10 a 190 190 0 0 1 95 0 a 190 190 0 0 1 -95 0"></path>
                                <path fill="#303030" stroke="#303030" stroke-width="5" stroke-linejoin="round"
                                    d="M -47.5 5 a 160 160 0 0 0 95 0 a 180 180 0 0 0 -95 0"></path>
                            </g>

                            <!-- círculos que describen el centro de la pokeball -->
                            <g class="center">
                                <circle fill="#ffffff" stroke="#303030" stroke-width="5" cx="0" cy="0" r="12"></circle>
                                <circle fill="#ffffff" stroke="#303030" stroke-width="3" cx="0" cy="0" r="6"></circle>
                                <!-- círculo más interno que resalta la pokeball -->
                                <g class="inner" opacity="0">
                                    <circle fill="#f15d5f" cx="0" cy="0" r="4.5"></circle>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
</template>

<script>
export default {
    name: 'PokeBallLoader',

    props: {
        size: {
            type: [String, Number],
            default: 150
        },
        state: {
            type: String,
            default: 'fetching', // 'cargando', 'éxito', 'fallo'
            validator: (value) => ['fetching', 'success', 'failure'].includes(value)
        }
    },

    computed: {
        animationClass() {
            return this.state
        }
    },

    mounted() {
        if (this.state === 'fetching') {
            this.startAnimation()
        }
    },

    watch: {
        state(newState, oldState) {
            if (oldState === 'fetching' && newState !== 'fetching') {
                this.stopAnimation()
            }
        }
    },

    beforeUnmount() {
        this.stopAnimation()
    },

    methods: {
        startAnimation() {
            const pokeball = this.$refs.pokeball
            if (pokeball) {
                pokeball.addEventListener('animationiteration', this.handleAnimationIteration)
            }
        },

        stopAnimation() {
            const pokeball = this.$refs.pokeball
            if (pokeball) {
                pokeball.removeEventListener('animationiteration', this.handleAnimationIteration)
            }
        },

        handleAnimationIteration() {
            this.$emit('animation-iteration')
        }
    },

    emits: ['animation-iteration']
}
</script>

<style scoped>
/* ANIMACIONES DE POKEBALL */
/* vibración para rotar g.gravity */
svg.fetching g.gravity {
    animation: shake 0.75s infinite cubic-bezier(0.645, 0.045, 0.355, 1);
}

@keyframes shake {
    20% {
        transform: rotate(-10deg);
    }

    60% {
        transform: rotate(10deg);
    }

    80% {
        transform: rotate(0deg);
    }
}

/* pulsación para cambiar el color del círculo más interno */
svg.fetching g.inner {
    animation: pulse 0.75s infinite cubic-bezier(0.645, 0.045, 0.355, 1);
}

@keyframes pulse {
    25% {
        opacity: 0.7;
    }

    50% {
        opacity: 0;
    }
}

/* compresión para la pokeball y la animación de éxito */
svg.success g.ball {
    animation: squash 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 2 alternate;
}

@keyframes squash {
    to {
        transform: scaleY(0.9);
    }
}

/* agrandar para las estrellas y la animación de éxito */
svg.success g.stars {
    animation: scaleUp 0.2s 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

@keyframes scaleUp {
    to {
        transform: scale(1);
    }
}

/* agrandar para los arcos entre las mitades de la pokeball y para la animación de fallo */
svg.failure g.open {
    animation: scaleUp 0.2s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

/* trasladar hacia arriba para la mitad superior y la animación de fallo */
svg.failure g.top {
    animation: translateUp 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

@keyframes translateUp {
    to {
        transform: translateY(-10px);
    }
}

/* trasladar hacia abajo para la mitad inferior y la animación de fallo */
svg.failure g.bottom {
    animation: translateDown 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

@keyframes translateDown {
    to {
        transform: translateY(5px);
    }
}

/* trasladar más alto para el centro y la animación de fallo */
svg.failure g.center {
    animation: translateHigher 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

@keyframes translateHigher {
    to {
        transform: translateY(-18px);
    }
}
</style>