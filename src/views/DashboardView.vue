<script setup lang="ts">
import "leaflet/dist/leaflet.css";

import { LMap, LTileLayer, LMarker, LPolygon } from "@vue-leaflet/vue-leaflet";
import { useI18n } from "vue-i18n";

import { useStreetlightStore } from "@/stores/streetlight-store";
import { useZoneStore } from "@/stores/zone-store";

const { t } = useI18n();

const streetlightStore = useStreetlightStore();
const zoneStore = useZoneStore();

const dashboardMapZoom = parseInt(import.meta.env.VITE_DASHBOARD_MAP_ZOOM);
const dashboardMapCenterLatitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LATITUDE);
const dashboardMapCenterLongitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LONGITUDE);

const thermostat1DashboardPanel1Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_1_URL.replace("$customText", t("dashboard.thermostat.temperature"));
const thermostat1DashboardPanel2Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_2_URL;
console.log(zoneStore.zones);
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-md-7 col-sm-12">
                <LMap :zoom="dashboardMapZoom" :center="[dashboardMapCenterLatitude, dashboardMapCenterLongitude]" :use-global-leaflet="false">
                    <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
                    <LMarker v-for="streetlight in streetlightStore.streetlights" :key="streetlight.id" :lat-lng="[streetlight.locationLongitude, streetlight.locationLatitude]" />
                    <LPolygon v-for="zone in zoneStore.zones" :key="zone.id" :lat-lngs="zone.coordinates" />
                </LMap>
            </div>
            <div class="col-md-5 col-sm-12">
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
