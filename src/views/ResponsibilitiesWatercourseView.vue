<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";

const deviceMeasurementStore = useDeviceMeasurementStore();
const measurements = ref([]);

onMounted(async () => {
    await deviceMeasurementStore.getDeviceMeasurements();
    measurements.value = deviceMeasurementStore.measurements;
})
console.log(measurements.value) ;
</script>
<template>
    <div>
        <h1>Responsibilities Watercourse View</h1>
        <ul>
           
        </ul>
    </div>
</template>


<style scoped></style>
