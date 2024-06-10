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
      streetlights.value = []
    }
    useOauthStore()
      .backend.get('/cities/' + cityId + '/zones/' + zoneId + '/streetlights')
      .then((response: AxiosResponse) => {
        console.log(response.data)

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
        '/cities/' + cityId + '/zone/' + zoneId + '/streetlights/' + streetlightId,
        data
      )
      .then((response: AxiosResponse) => {
        console.log('Réponse du serveur:', response.data)
      })
  }

  $reset()

  return {
    streetlights,
    $reset,
    getStreetLight,
    patchStreetLight
  }
})
