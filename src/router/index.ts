import { createRouter, createWebHistory } from 'vue-router'
import Tdc_dashboardView from '../views/Tdc_dashboardView.vue'
import OauthCallback from '@/components/OauthCallback.vue'
import { useOauthStore } from '../stores/oauth-store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',

      name: 'Dashboard',
      component: Tdc_dashboardView
    },
    {
      path: '/oauth2/callback',
      name: 'callback',
      component: OauthCallback
    }
  ]
})

router.beforeEach((to) => {
  const oauthStore = useOauthStore()

  if (!oauthStore.isConnected && to.name != 'callback') {
    const linkRedirect =
      import.meta.env.VITE_IDENTITY_MANAGER_URL +
      '/oauth2/authorize?client_id=' +
      import.meta.env.VITE_IDENTITY_MANAGER_APP_CLIENT_ID +
      '&response_type=token&redirect_uri=' +
      import.meta.env.VITE_IDENTITY_MANAGER_APP_REDIRECT_URI +
      '&state=false'
    window.location.href = linkRedirect
    return false
  }
})

export default router
