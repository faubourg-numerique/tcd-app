<template>
    <div class="container">
      <h1>Details for Watercourse Responsibility</h1>
    
      <div v-if="measurement">
        <p><strong>Name:</strong> {{ measurement.name.value }}</p>
        <p><strong>Distance:</strong> {{ measurement.distance?.value ?? 'N/A' }} {{ measurement.distance?.unit?.value ?? 'N/A' }}</p>
        <p><strong>Max Alert:</strong> {{ measurement.maxAlerte?.value ?? 'N/A' }}</p>
        <p><strong>Current Alert:</strong> {{ measurement.enAlerte?.value ?? 'N/A' }}</p>
        <p><strong>Temporisation:</strong> {{ measurement.temporisation?.value ?? 'N/A' }}</p>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";
  
 
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
  
  const route = useRoute();
  const deviceMeasurementStore = useDeviceMeasurementStore();
  const measurement = ref<Measurement | null>(null);
  
  onMounted(async () => {
    const measurementId = route.params.id as string;
    await deviceMeasurementStore.getDeviceMeasurements();
    measurement.value = deviceMeasurementStore.measurements.find(
      (m: Measurement) => m.id === measurementId
    ) ?? null;
  });
  </script>
  
  <style scoped>
  .container {
    margin-top: 20px;
  }
  
  p {
    margin: 10px 0;
  }
  
  strong {
    color: #333;
  }
  </style>
  