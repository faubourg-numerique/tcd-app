<template>
    <div v-if="grafanaUrl">
      <h2>Visualisation</h2>
      <iframe :src="grafanaUrl" width="450" height="200" frameborder="0"></iframe>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    grafanaUrl: string;
  }>();
  </script>
  