<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";
import { useRouter } from 'vue-router';

// Définir le type pour les objets measurement
interface Measurement {
  id: string;
  measurementType: {
    value: string;
  };
  name: {
    value: string;
  };
  distance?: {
    value: number;
    unit?: {
      value: string;
    };
  };
  maxAlerte?: {
    value: string;
  };
  enAlerte?: {
    value: string;
  };
  temporisation?: {
    value: string;
  };
}

const deviceMeasurementStore = useDeviceMeasurementStore();
const measurements = ref<Measurement[]>([]);
const router = useRouter();

onMounted(async () => {
    await deviceMeasurementStore.getDeviceMeasurements();
    measurements.value = deviceMeasurementStore.measurements.filter((measurement: Measurement) => measurement.measurementType.value === 'water-level');
});
</script>

<template>
    <div class="container">
        <h1>Responsibilities Watercourse</h1>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Distance</th>
                        <th>Max alerte</th>
                        <th>En alerte</th>
                        <th>Temporisation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="measurement in measurements" :key="measurement.id">
                        <td>
                            <router-link :to="`/responsibilities/watercourse/${measurement.id}`" class="no-link">
                                {{ measurement.name.value }} 
                            </router-link>
                        </td>
                        <td>{{ measurement.distance?.value ?? 'N/A' }} {{ measurement.distance?.unit?.value ?? 'N/A' }}</td>
                        <td>{{ measurement.maxAlerte?.value ?? 'N/A' }}</td>
                        <td>{{ measurement.enAlerte?.value ?? 'N/A' }}</td>
                        <td>{{ measurement.temporisation?.value ?? 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
a:hover {
    border-bottom: 1px solid;
    background: rgb(220, 53, 69);
}
a {
    text-decoration: none;
    color: inherit;
    cursor: default;
}
</style>
