<template>
    <div>
      <h2>Géneral</h2>
      <p><strong>Name:</strong> {{ measurement.name.value }}</p>
      <p><strong>Distance:</strong> {{ measurement.distance?.value ?? 'N/A' }} {{ measurement.distance?.unit?.value ?? 'N/A' }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Measurement } from '@/models/Measurement';
  
  defineProps<{
    measurement: Measurement;
  }>();
  </script>
  