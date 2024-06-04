import { createRouter, createWebHistory } from 'vue-router'
import Tdc_dashboardView from '../views/Tdc_dashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Tdc_dashboardView 
    },

  ]
})

export default router
