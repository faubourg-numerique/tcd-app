<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useThermostat } from '@/stores/thermostat-store'

const thermostatStore = useThermostat()

const submitForm = (submitIndex: number) => {
  const data = {
    value: thermostatStore.thermostats[submitIndex].temperature
  }
  thermostatStore.patchThermostat(data, 'test', thermostatStore.thermostats[submitIndex].id)
}

onMounted(() => {
  thermostatStore.getThermostats('test')
})
</script>

<template>
  <div
    v-for="(data, index) in thermostatStore.thermostats"
    :key="index"
    class="form-thermostat-container col-md m-3"
  >
    <form
      class="container border thermostatForm rounded d-flex flex-column align-items-center"
      @submit.prevent=""
    >
      <div class="mb-3 w-50 form-group">
        <label for="temperature" class="form-label">Temperature</label>
        <input
          id="temperature"
          v-model="data.temperature"
          type="number"
          min="-20"
          max="60"
          step="0.1"
          placeholder="Temperature"
          required
          class="form-control"
        />
      </div>

      <div class="mb-3 w-50 text-center form-group">
        <p class="textRed">{{ data.name }}</p>
        <input
          :id="'statusThermostat' + index"
          type="submit"
          class="btn btn-primary mt-auto"
          @click="submitForm(index)"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.thermostatForm {
  height: 100%;
  border-color: red !important;
}

.textRed {
  color: red;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
