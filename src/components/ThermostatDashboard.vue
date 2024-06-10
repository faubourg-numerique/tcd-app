<script setup lang="ts">
const thermostat1DashboardPanel1Url = import.meta.env
  .VITE_THERMOSTAT_1_DASHBOARD_PANEL_1_URL as string
const thermostat1DashboardPanel2Url = import.meta.env
  .VITE_THERMOSTAT_1_DASHBOARD_PANEL_2_URL as string
const thermostat1DashboardPanel3Url = import.meta.env
  .VITE_THERMOSTAT_1_DASHBOARD_PANEL_3_URL as string
const thermostat1DashboardPanel4Url = import.meta.env
  .VITE_THERMOSTAT_1_DASHBOARD_PANEL_4_URL as string
</script>

<template>
  <div class="rounded col-md m-3 container-iframe-thermostat">
    <iframe
      class="w-100 h-100 rounded border iframe-thermostat h-100"
      :src="thermostat1DashboardPanel2Url"
      frameborder="0"
    />
  </div>
  <div class="rounded col-md m-3 container-iframe-thermostat">
    <iframe
      class="w-100 h-100 rounded border iframe-thermostat h-100"
      :src="thermostat1DashboardPanel3Url"
      frameborder="0"
    />
  </div>
  <div class="rounded col-md m-3 container-iframe-thermostat">
    <iframe
      class="w-100 h-100 rounded border iframe-thermostat h-100"
      :src="thermostat1DashboardPanel1Url"
      frameborder="0"
    />
  </div>
  <div class="rounded col-md m-3 container-iframe-thermostat">
    <iframe
      class="w-100 h-100 rounded border iframe-thermostat h-100"
      :src="thermostat1DashboardPanel4Url"
      frameborder="0"
    />
  </div>
</template>

<style scoped>
.container-iframe-thermostat {
  min-width: 27%;
  min-height: 30vh;
}

.iframe-thermostat {
  border-color: red !important;
}
</style>
