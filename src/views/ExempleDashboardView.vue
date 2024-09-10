<script setup lang="ts">
const exemplePanel1Url = import.meta.env.VITE_EXEMPLE_DASHBOARD_PANEL_1_URL;
</script>

<template>
    <div class="container">
        <h1 class="mb-4">{{ $t("nav.ExempleDashboard") }}</h1>
        <small class="d-block mb-3">Qualité de l’air CO2, Température, Humidité, Mouvement /Mairie de LONG / Salle des fêtes</small>
        <div class="row row-cols-1 row-cols-md-2 g-3">
            <div v-for="(panelUrl, index) in [exemplePanel1Url]" :key="index" class="col">
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
