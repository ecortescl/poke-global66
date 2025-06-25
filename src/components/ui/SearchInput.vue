<template>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        </div>
        <input type="text" :class="inputClasses" :placeholder="placeholder" :value="modelValue" @input="handleInput"
            @focus="handleFocus" @blur="handleBlur" />
    </div>
</template>

<script>
export default {
    name: 'SearchInput',

    props: {
        modelValue: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Buscar...'
        },
        customClasses: {
            type: String,
            default: ''
        }
    },

    emits: ['update:modelValue', 'focus', 'blur', 'search'],

    data() {
        return {
            isFocused: false
        }
    },

    computed: {
        inputClasses() {
            const baseClasses = 'block w-full pl-10 pr-3 py-3 border rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none transition-colors duration-200'
            const focusClasses = this.isFocused
                ? 'border-blue-500 ring-2 ring-blue-500'
                : 'border-gray-300 hover:border-gray-400'

            return `${baseClasses} ${focusClasses} ${this.customClasses}`
        }
    },

    methods: {
        handleInput(event) {
            const value = event.target.value
            this.$emit('update:modelValue', value)

            // Emit search event con debounce
            this.debounceSearch(value)
        },

        handleFocus(event) {
            this.isFocused = true
            this.$emit('focus', event)
        },

        handleBlur(event) {
            this.isFocused = false
            this.$emit('blur', event)
        },

        debounceSearch(value) {
            // Limpiar timeout anterior
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout)
            }

            // Crear nuevo timeout para búsqueda
            this.searchTimeout = setTimeout(() => {
                this.$emit('search', value)
            }, 300) // 300ms de debounce
        }
    },

    beforeUnmount() {
        // Limpiar timeout al destruir componente
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout)
        }
    }
}
</script>

<style scoped>
/* Estilos específicos para SearchInput */
</style>