<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const thermostat1DashboardPanel1Url =
  import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_1_URL.replace(
    '$customText',
    t('dashboard.thermostat.temperature')
  ) as string
const thermostat1DashboardPanel2Url = import.meta.env
  .VITE_THERMOSTAT_1_DASHBOARD_PANEL_2_URL as string
const thermostat1DashboardPanel3Url =
  import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_3_URL.replace(
    '$customText',
    t('dashboard.thermostat.temperature')
  ) as string
const thermostat1DashboardPanel4Url =
  import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_4_URL.replace(
    '$customText',
    t('dashboard.thermostat.electricity')
  ) as string
</script>

<template>
  <div class="rounded col-md mt-3 mb-3 container-iframe-thermostat w-100">
    <iframe
      class="w-100 h-100 rounded border iframe-thermostat h-100"
      :src="thermostat1DashboardPanel2Url"
      frameborder="0"
    />
  </div>
  <div class="rounded col-md mt-3 mb-3 container-iframe-thermostat w-100">
    <iframe
      class="w-100 h-100 rounded border iframe-thermostat h-100"
      :src="thermostat1DashboardPanel3Url"
      frameborder="0"
    />
  </div>
  <div class="rounded col-md mt-3 mb-3 container-iframe-thermostat w-100">
    <iframe
      class="w-100 h-100 rounded border iframe-thermostat h-100"
      :src="thermostat1DashboardPanel1Url"
      frameborder="0"
    />
  </div>
  <div class="rounded col-md mt-3 mb-3 container-iframe-thermostat w-100">
    <iframe
      class="w-100 h-100 rounded border iframe-thermostat h-100"
      :src="thermostat1DashboardPanel4Url"
      frameborder="0"
    />
  </div>
</template>

<style scoped>
.container-iframe-thermostat {
  min-width: 300px;
  min-height: 30vh;
}

.iframe-thermostat {
  border-color: red !important;
}
</style>
