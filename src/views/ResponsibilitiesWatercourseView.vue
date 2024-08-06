<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";

const deviceMeasurementStore = useDeviceMeasurementStore();
const measurements = ref([]);

onMounted(async () => {
    await deviceMeasurementStore.getDeviceMeasurements();
    measurements.value = deviceMeasurementStore.measurements;
});
</script>

<template>
    <div>
        <h1>Responsibilities Watercourse View</h1>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Distance</th>
                    <th>Humidity</th>
                    <th>Temperature</th>
                    <th>Pressure</th>
                    <th>Voltage (Vdd)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="measurement in measurements" :key="measurement.id">
                    <td>{{ measurement.id }}</td>
                    <td>{{ measurement.name.value }}</td>
                    <td>{{ measurement.distance?.value }}</td>
                    <td>{{ measurement.humidity?.value }}</td>
                    <td>{{ measurement.temperature?.value }}</td>
                    <td>{{ measurement.pressure?.value }}</td>
                    <td>{{ measurement.vdd?.value }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.table {
    margin-top: 20px;
}
</style>
