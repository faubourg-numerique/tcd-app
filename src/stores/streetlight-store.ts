import { ref } from 'vue'
import { type AxiosResponse } from 'axios'
import { useOauthStore } from './oauth-store'
import { defineStore } from 'pinia'

export const useStreetlight = defineStore('streetLIght', () => {
  const streetlights = ref([{ powerState: 'on', id: '', name: '', hasZone: '' }])

  const $reset = () => {
    streetlights.value = []
  }

  const getStreetLight = async (cityId: String, zoneId: String) => {
    $reset()
    if (cityId === undefined || zoneId === undefined) {
      return
    }
    useOauthStore()
      .backend.get('/cities/' + cityId + '/zones/' + zoneId + '/streetlights')
      .then((response: AxiosResponse) => {
        streetlights.value = response.data
      })
      .catch((error: Error) => {
        console.error('Erreur lors de la requête GET:', error)
      })
  }

  const patchStreetLight = (
    data: Object,
    cityId: String,
    zoneId: String,
    streetlightId: String
  ) => {
    useOauthStore()
      .backend.patch(
        '/cities/' + cityId + '/zones/' + zoneId + '/streetlights/' + streetlightId,
        data
      )
      .then((response: AxiosResponse) => {})
  }

  $reset()

  return {
    streetlights,
    $reset,
    getStreetLight,
    patchStreetLight
  }
})
