<template>
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div class="container mx-auto max-w-md">
            <div class="flex space-x-3">
                <button @click="selectTab('all')"
                    :class="activeTab === 'all' ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'"
                    class="flex-1 py-3 px-6 rounded-full font-medium flex items-center justify-center space-x-2 transition-colors duration-200 shadow-lg">
                    <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path
                            d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                    </svg>
                    <span>All</span>
                </button>

                <button @click="selectTab('favorites')"
                    :class="activeTab === 'favorites' ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'"
                    class="flex-1 py-3 px-6 rounded-full font-medium flex items-center justify-center space-x-2 transition-colors duration-200 shadow-lg">
                    <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Favorites</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BottomNavigation',

    props: {
        activeTab: {
            type: String,
            default: 'all',
            validator: (value) => ['all', 'favorites'].includes(value)
        }
    },

    emits: ['tab-change'],

    methods: {
        selectTab(tabName) {
            if (tabName !== this.activeTab) {
                this.$emit('tab-change', tabName)
            }
        }
    }
}
</script>

<style scoped>
/* Estilos específicos para BottomNavigation */
</style>