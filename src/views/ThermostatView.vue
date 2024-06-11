<script setup lang="ts">
import ThermostatManager from '@/components/ThermostatManager.vue'
import ThermostatDashboard from '@/components/ThermostatDashboard.vue'
</script>

<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <ThermostatManager />
      <ThermostatDashboard />
    </div>
  </div>
</template>
