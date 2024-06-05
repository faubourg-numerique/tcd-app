<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type AxiosResponse } from 'axios'
import { useOauthStore } from '../stores/oauth-store'

const streetlights = ref([{ status: 'on', id: '' }])
const useOauthStoreInstance = useOauthStore()

const submitForm = (index: number): void => {
  setTimeout(() => {
    const data = {
      value: streetlights.value[index].status
    }
    useOauthStoreInstance.backend
      .patch(
        '/cities/' +
          import.meta.env.VITE_DEFAULT_CITY_ENTITY_ID +
          '/zone/' +
          import.meta.env.VITE_DEFAULT_ZONE_ENTITY_ID +
          '/streetlights/' +
          streetlights.value[index].id,
        data
      )
      .then((response: AxiosResponse) => {
        console.log('Réponse du serveur:', response.data)
      })
  }, 100)
}

const getStreetLight = () => {
  useOauthStore()
    .backend.get(
      '/cities/' +
        import.meta.env.VITE_DEFAULT_CITY_ENTITY_ID +
        '/zone/' +
        import.meta.env.VITE_DEFAULT_ZONE_ENTITY_ID +
        '/streetlights'
    )
    .then((response: AxiosResponse) => {
      streetlights.value = []

      for (let i = 0; i < response.data.length; i++) {
        streetlights.value.push(response.data[i])
      }
    })
    .catch((error: Error) => {
      console.error('Erreur lors de la requête GET:', error)
    })
}

const toggleStatus = (streetLightObject: { status: string }) => {
  streetLightObject.status = streetLightObject.status === 'on' ? 'off' : 'on'
}
onMounted(getStreetLight)
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div v-for="(streetLightObject, index) in streetlights" :key="index" class="col-md mb-4">
        <form class="bg-white p-1 rounded text-center border streetlightForm" @submit.prevent="">
          <div class="input-group d-block max-auto">
            <label :for="'statusLight' + index" class="fs-1" role="button">
              <font-awesome-icon
                v-if="streetLightObject.status === 'on'"
                :icon="['fas', 'lightbulb']"
              />
              <font-awesome-icon v-else :icon="['far', 'lightbulb']" />
            </label>
            <p class="fs-6">
              {{ streetLightObject.status }}
            </p>
            <p class="fs-6">
              {{ streetLightObject.id }}
            </p>
            <input
              :id="'statusLight' + index"
              type="checkbox"
              class="d-none"
              :checked="streetLightObject.status === 'on'"
              @click="submitForm(index)"
              @change="toggleStatus(streetLightObject)"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.streetlightForm {
  border-color: red !important;
}
</style>
