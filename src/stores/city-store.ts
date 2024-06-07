import { ref } from 'vue'
import { type AxiosResponse } from 'axios'
import { useOauthStore } from './oauth-store'
import { defineStore } from 'pinia'

export const useCity = defineStore('city', () => {
  const cities = ref([{ id: '', name: '' }])

  const $reset = () => {
    cities.value = []
  }

  const getCities = async () => {
    $reset()
    useOauthStore()
      .backend.get('/cities')
      .then((response: AxiosResponse) => {
        cities.value = response.data
      })
      .catch((error: Error) => {
        console.error('Erreur lors de la requête GET:', error)
      })
  }

  return {
    cities,
    $reset,
    getCities
  }
})
