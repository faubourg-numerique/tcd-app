<script setup lang="ts">
const indoorAmbiancePanel1Url = import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_1_URL;
const indoorAmbiancePanel2Url = import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_2_URL;
const indoorAmbiancePanel3Url = import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_3_URL;
const indoorAmbiancePanel4Url = import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_4_URL;
</script>

<template>
  <div class="container">
    <h1 class="mb-4">{{ $t("nav.indoorAmbiance") }}</h1>
    <div class="row row-cols-1 row-cols-md-2 g-3">
      <div v-for="(panelUrl, index) in [indoorAmbiancePanel1Url, indoorAmbiancePanel2Url, indoorAmbiancePanel3Url, indoorAmbiancePanel4Url]" :key="index" class="col">
        <iframe :src="panelUrl" class="w-100" height="300"></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
iframe {
  border: none;
  margin-bottom: 20px;
}
</style>
