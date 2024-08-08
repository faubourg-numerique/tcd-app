<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";

const deviceMeasurementStore = useDeviceMeasurementStore();
const measurements = ref([]);

onMounted(async () => {
    await deviceMeasurementStore.getDeviceMeasurements();
    measurements.value = deviceMeasurementStore.measurements.filter((measurement) => measurement.measurementType.value === 'water-level');

    console.log(measurements.value); 
});
</script>

<template>
    <div class="container">
        <h1>Responsibilities Watercourse</h1>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr class="">
                        <th>Name</th>
                        <th>Distance</th>
                        <th>Max alerte</th>
                        <th>En alerte</th>
                        <th>Temporisation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="measurement in measurements" :key="measurement.id">
                        <td>{{ measurement.name.value }}</td>
                        <td>{{ measurement.distance?.value ?? 'N/A'}}{{ measurement.distance?.unit?.value ?? 'N/A'}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
</style>
