import { ref } from 'vue'
import { type AxiosResponse } from 'axios'
import { useOauthStore } from './oauth-store'
import { defineStore } from 'pinia'
import type { Zone } from '@/model/Zone'

export const useZone = defineStore('zone', () => {
  const zones = ref<Zone[]>([])
  const zoneSelected = ref('')

  const $reset = () => {
    zones.value = []
  }

  const getZones = async (cityId: String) => {
    $reset()
    await useOauthStore()
      .backend.get('/cities/' + cityId + '/zones')
      .then((response: AxiosResponse) => {
        zones.value = response.data
        return
      })
      .catch((error: Error) => {
        console.error('Erreur lors de la requête GET:', error)
      })
  }

  $reset()

  return {
    zones,
    $reset,
    getZones,
    zoneSelected
  }
})
