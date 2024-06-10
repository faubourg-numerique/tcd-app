import { ref } from 'vue'
import { type AxiosResponse } from 'axios'
import { useOauthStore } from './oauth-store'
import { defineStore } from 'pinia'

export const useThermostat = defineStore('thermostat', () => {
  const thermostats = ref([{ temperature: 0, id: '', name: '' }])

  const $reset = () => {
    thermostats.value = []
  }

  const patchThermostat = (data: Object, cityId: String, thermostatId: String) => {
    useOauthStore()
      .backend.patch('/thermostats/' + thermostatId, data)
      .then((response: AxiosResponse) => {
        console.log(response)
      })
  }
  const getThermostats = async (cityId: String) => {
    $reset()
    await useOauthStore()
      .backend.get('/thermostats')
      .then((response: AxiosResponse) => {
        console.log(response.data)
        thermostats.value = response.data
      })
      .catch((error: Error) => {
        console.error('Erreur lors de la requête GET:', error)
      })
  }

  $reset()

  return {
    thermostats,
    $reset,
    patchThermostat,
    getThermostats
  }
})
