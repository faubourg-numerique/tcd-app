<script setup lang="ts">
import { onMounted } from 'vue'
import { useStreetlight } from '@/stores/streetlight-store'
import { useCity } from '../stores/city-store'
import { useZone } from '../stores/zone-store'

const zoneStore = useZone()
const streetLightStore = useStreetlight()
const cityStore = useCity()

onMounted(() => {
  cityStore.getCities()
})

const handleChangeSelectCities = async (event: Event): Promise<void> => {
  const target = event.target as HTMLSelectElement
  cityStore.citySelected = target.value

  await zoneStore.getZones(cityStore.citySelected)
}

const handleChangeSelectZones = async (event: Event): Promise<void> => {
  const target = event.target as HTMLSelectElement
  zoneStore.zoneSelected = target.value
  await streetLightStore.getStreetLight(cityStore.citySelected, zoneStore.zoneSelected)
}

const submitForm = (index: number): void => {
  setTimeout(() => {
    const data = {
      value: streetLightStore.streetlights[index].powerState
    }
    streetLightStore.patchStreetLight(
      data,
      cityStore.citySelected,
      zoneStore.zoneSelected,
      streetLightStore.streetlights[index].id
    )
  }, 100)
}

const toggleStatus = (streetLightObject: { powerState: string }) => {
  streetLightObject.powerState = streetLightObject.powerState === 'on' ? 'off' : 'on'
}
</script>

<template>
  <div class="m-4">
    <form class="bg-white p-4 rounded text-center border streetlightForm" @submit.prevent="">
      <div class="form-group">
        <label for="citySelection" class="form-label">Sélectionnez une ville</label>
        <select id="citySelection" class="form-select" @change="handleChangeSelectCities">
          <option value="" disabled selected>Sélectionnez une ville</option>
          <option v-for="city in cityStore.cities" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
      </div>

      <div class="form-group" v-if="zoneStore.zones.length > 0">
        <label for="zoneSelection" class="form-label">Sélectionnez une zone</label>
        <select id="zoneSelection" class="form-select" @change="handleChangeSelectZones">
          <option value="" disabled selected>Sélectionnez une zone</option>
          <option v-for="zone in zoneStore.zones" :key="zone.id" :value="zone.id">
            {{ zone.name }}
          </option>
        </select>
      </div>
    </form>
  </div>
  <div class="container-fluid" v-if="streetLightStore.streetlights.length > 0">
    <div class="row">
      <div
        v-for="(streetLightObject, index) in streetLightStore.streetlights"
        :key="index"
        class="col-md mb-4"
      >
        <form class="bg-white p-1 rounded text-center border streetlightForm" @submit.prevent="">
          <div class="input-group d-block max-auto">
            <label :for="'statusLight' + index" class="fs-1" role="button">
              <font-awesome-icon
                v-if="streetLightObject.powerState === 'on'"
                :icon="['fas', 'lightbulb']"
              />
              <font-awesome-icon v-else :icon="['far', 'lightbulb']" />
            </label>
            <p class="fs-6">
              {{ streetLightObject.powerState }}
            </p>
            <p class="fs-6 textRed">
              {{ streetLightObject.name }}
            </p>
            <input
              :id="'statusLight' + index"
              type="checkbox"
              class="d-none"
              :checked="streetLightObject.powerState === 'on'"
              @click="submitForm(index)"
              @change="toggleStatus(streetLightObject)"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="container-fluid" v-else>
    <div class="center">
      <p class="text-center"></p>
      <p class="text-center">
        Oups désolé, mais tu n'as pas tout sélectionné ou il n'y a aucun lampadaire.
      </p>
    </div>
  </div>
</template>

<style scoped>
.streetlightForm {
  border-color: red !important;
}

.textRed {
  color: red;
}
</style>
