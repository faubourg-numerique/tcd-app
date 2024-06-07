import { ref } from 'vue'
import { type AxiosResponse } from 'axios'
import { useOauthStore } from './oauth-store'
import { defineStore } from 'pinia'

export const useZone = defineStore('zone', () => {
  const zones = ref([{ powerState: 'on', id: '', name: '', hasZone: '' }])

  const $reset = () => {
    zones.value = []
  }

  const getZones = async (cityId: String) => {
    $reset()
    useOauthStore()
      .backend.get('/cities/' + cityId + '/zones')
      .then((response: AxiosResponse) => {
        zones.value = response.data
      })
      .catch((error: Error) => {
        console.error('Erreur lors de la requête GET:', error)
      })
  }

  return {
    zones,
    $reset,
    getZones
  }
})
