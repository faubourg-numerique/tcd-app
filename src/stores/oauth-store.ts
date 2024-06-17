import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

import axios, { type AxiosInstance } from 'axios'

export const useOauthStore = defineStore('oauth', () => {
  const isConnected: Ref<boolean> = ref(false)
  const roles: Ref<string[]> = ref([])

  const name: Ref<string> = ref('')

  const backend: AxiosInstance = axios.create()

  function countRightRole(): number {
    let countRole = roles.value.length
    JSON.parse(import.meta.env.VITE_ARRAY_ROLES_WITHOUT_RIGHTS).forEach((role: string) => {
      if (roles.value.includes(role)) {
        countRole--
      }
    })
    console.log(countRole)
    return countRole
  }

  function $reset() {
    isConnected.value = false
    name.value = ''
    backend.defaults.headers.common['Authorization'] = ''
  }

  return {
    isConnected,
    backend,
    name,
    roles,
    countRightRole,
    $reset
  }
})
