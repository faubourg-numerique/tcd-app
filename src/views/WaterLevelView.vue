<script setup lang="ts">
const waterLevelPanel1Url = import.meta.env.VITE_WATER_LEVEL_DASHBOARD_PANEL_1_URL;
const waterLevelPanel2Url = import.meta.env.VITE_WATER_LEVEL_DASHBOARD_PANEL_2_URL;
const waterLevelPanel3Url = import.meta.env.VITE_WATER_LEVEL_DASHBOARD_PANEL_3_URL;
const waterLevelPanel4Url = import.meta.env.VITE_WATER_LEVEL_DASHBOARD_PANEL_4_URL;
</script>

<template>
  <div class="container">
    <h1 class="mb-4">{{ $t('nav.waterLevel') }}</h1>
    <div class="row row-cols-1 row-cols-md-2 g-3">
      <div v-for="(panelUrl, index) in [waterLevelPanel1Url, waterLevelPanel2Url, waterLevelPanel3Url, waterLevelPanel4Url]" :key="index" class="col">
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
