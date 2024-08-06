<script setup lang="ts">
import "leaflet/dist/leaflet.css";

import { LMap, LTileLayer, LMarker, LPolygon } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import { useI18n } from "vue-i18n";

import { useCityStore } from "@/stores/city-store";
import { useStreetlightStore } from "@/stores/streetlight-store";
import { useZoneStore } from "@/stores/zone-store";
import  TcdAppPlanning  from "@/components/Tcd-App-Planning.vue";

const { t } = useI18n();

const cityStore = useCityStore();
const streetlightStore = useStreetlightStore();
const zoneStore = useZoneStore();

const dashboardMapZoom = parseInt(import.meta.env.VITE_DASHBOARD_MAP_ZOOM);
const dashboardMapCenterLatitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LATITUDE);
const dashboardMapCenterLongitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LONGITUDE);

const thermostat1DashboardPanel1Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_1_URL.replace("$customText", t("dashboard.thermostat.temperature"));
const thermostat1DashboardPanel2Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_2_URL;

const streetlightIcon = L.divIcon({
    className: "iconLeaflet",
    iconSize: [20, 20],
    html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#f1c40f" stroke="black" d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"/></svg>',
}) as unknown as L.Icon<L.IconOptions>;

const cityIcon = L.divIcon({
    className: "iconLeaflet",
    iconSize: [40, 40],
    html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="#842E1B" stroke="black" d="M288 48c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 144 40 0 0-72c0-13.3 10.7-24 24-24s24 10.7 24 24l0 72 24 0c26.5 0 48 21.5 48 48l0 224c0 26.5-21.5 48-48 48l-160 0-96 0c-26.5 0-48-21.5-48-48l0-416zm64 32l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm16 80c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM352 272l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm176-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM512 368l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zM224 160c0 6-1 11-2 16c20 14 34 38 34 64c0 45-36 80-80 80l-16 0 0 160c0 18-15 32-32 32c-18 0-32-14-32-32l0-160-16 0c-45 0-80-35-80-80c0-26 13-50 33-64c-1-5-1-10-1-16c0-53 42-96 96-96c53 0 96 43 96 96z"/></svg>',
}) as unknown as L.Icon<L.IconOptions>;
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-md-7 col-sm-12">
                <LMap style="min-height: 40vh" :zoom="dashboardMapZoom" :center="[dashboardMapCenterLatitude, dashboardMapCenterLongitude]" :use-global-leaflet="false">
                    <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
                    <LMarker v-for="streetlight in streetlightStore.streetlights" :key="streetlight.id" :lat-lng="[streetlight.locationLongitude, streetlight.locationLatitude]" :icon="streetlightIcon" />
                    <LMarker v-for="city in cityStore.cities" :key="city.id" :lat-lng="[city.locationLongitude, city.locationLatitude]" :icon="cityIcon" />
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
            <div>
               <TcdAppPlanning/> 
            </div>
        </div>
    </div>
</template>
