import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import LoadingView from '../views/LoadingView.vue'
import HomeView from '../views/HomeView.vue'
import EmptyListView from '../views/EmptyListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/loading',
      name: 'loading',
      component: LoadingView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/empty-list',
      name: 'empty-list',
      component: EmptyListView,
    },
  ],
})

export default router
