<script setup lang="ts">
const airQualityDashboardPanel1Url = import.meta.env.VITE_AIR_QUALITY_DASHBOARD_PANEL_1_URL;
</script>

<template>
    <div class="container">
        <h1 class="mb-4">{{ $t("main.airQuality") }}</h1>
        <small class="d-block mb-3">Qualité de l'air CO2, Température, Humidité, Mouvement / Mairie de LONG / Salle des fêtes</small>
        <div class="row row-cols-1 row-cols-md-2 g-3">
            <div class="col">
                <iframe :src="airQualityDashboardPanel1Url" class="w-100" height="300"></iframe>
            </div>
        </div>
    </div>
</template>
