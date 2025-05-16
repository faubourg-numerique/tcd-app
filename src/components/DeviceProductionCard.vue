<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title: string;
  items: any[];
}>();
</script>

<template>
  <div class="card border-success h-100">
    <div class="card-body">
      <h5 class="card-title text-success">{{ title }}</h5>
      <ul class="list-unstyled">
        <li v-for="item in items" :key="item.id" class="mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0 text-primary">
              {{ item.type.split(':').pop() }}
            </h6>
          </div>
          <div class="mt-2">
            <div><strong class="text-info">Power:</strong> {{ item.currentPowerProduction?.value !== undefined ? `${item.currentPowerProduction.value} kW` : 'N/A' }}</div>
            <template v-if="item.rotationSpeed">
              <div><strong class="text-info">Rotation Speed:</strong> {{ item.rotationSpeed.value !== undefined ? `${item.rotationSpeed.value} rpm` : 'N/A' }}</div>
              <div><strong class="text-info">Wind Speed:</strong> {{ item.simulatedWindSpeed?.value !== undefined ? `${item.simulatedWindSpeed.value} km/h` : 'N/A' }}</div>
            </template>
            <template v-if="item.EnergyGenerated">
              <div><strong class="text-info">Energy Generated:</strong> {{ item.EnergyGenerated?.value !== undefined ? `${item.EnergyGenerated.value} kWh` : 'N/A' }}</div>
              <div><strong class="text-info">Sunlight:</strong> {{ item.simulatedSunlight?.value !== undefined ? item.simulatedSunlight.value : 'N/A' }}</div>
            </template>
            <div><strong class="text-info">Status:</strong> {{ (item.status?.value || item.Status?.value) ?? 'N/A' }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-title {
  margin-bottom: 1rem;
}

ul {
  padding-left: 0;
}

li {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

li:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.text-info {
  font-weight: bold;
}
</style>