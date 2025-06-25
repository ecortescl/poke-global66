<template>
    <transition name="alert-fade">
        <div v-if="visible" class="success-alert">
            <div class="alert-content">
                <!-- Icono de éxito -->
                <div class="success-icon">
                    <svg class="checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <!-- Mensaje -->
                <div class="alert-message">
                    <p class="message-text">{{ message }}</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'SuccessAlert',

    props: {
        message: {
            type: String,
            default: '¡Operación exitosa!'
        },
        duration: {
            type: Number,
            default: 3000
        },
        visible: {
            type: Boolean,
            default: false
        }
    },

    emits: ['close'],

    watch: {
        visible(newVal) {
            if (newVal) {
                // Auto-cerrar después del tiempo especificado
                setTimeout(() => {
                    this.$emit('close')
                }, this.duration)
            }
        }
    }
}
</script>

<style scoped>
.success-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10001;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    max-width: 350px;
    min-width: 280px;
}

.alert-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.success-icon {
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.checkmark {
    width: 16px;
    height: 16px;
    color: white;
    animation: checkmarkDraw 0.6s ease-in-out;
}

.alert-message {
    flex: 1;
}

.message-text {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
}

/* Animaciones */
.alert-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.alert-fade-leave-active {
    transition: all 0.3s ease-in;
}

.alert-fade-enter-from {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
}

.alert-fade-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
}

.alert-fade-enter-to {
    opacity: 1;
    transform: translateX(0) scale(1);
}

@keyframes checkmarkDraw {
    0% {
        stroke-dasharray: 0 100;
        stroke-dashoffset: 0;
    }

    100% {
        stroke-dasharray: 100 0;
        stroke-dashoffset: 0;
    }
}

/* Responsive */
@media (max-width: 480px) {
    .success-alert {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
</style>