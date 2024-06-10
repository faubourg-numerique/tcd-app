<script setup lang="ts">
const mapMainDashboard = import.meta.env.VITE_MAP_MAIN_DASHBOARD as string
const thermostat1DashboardPanel1Url = import.meta.env
  .VITE_THERMOSTAT_1_DASHBOARD_PANEL_1_URL as string
const thermostat1DashboardPanel2Url = import.meta.env
  .VITE_THERMOSTAT_1_DASHBOARD_PANEL_2_URL as string
</script>

<template>
  <div class="w-90 main-div-dashboard m-3">
    <div class="row h-100">
      <div class="col-8">
        <iframe class="h-100 w-100" :src="mapMainDashboard" frameborder="0"></iframe>
      </div>
      <div class="col">
        <div class="w-100">
          <iframe class="h-100 w-100" :src="thermostat1DashboardPanel1Url" frameborder="0"></iframe>
        </div>
        <div class="w-100">
          <iframe class="h-100 w-100" :src="thermostat1DashboardPanel2Url" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-div-dashboard {
  height: 80vh;
}
</style>
