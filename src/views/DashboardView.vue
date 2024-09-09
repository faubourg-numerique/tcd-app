<script setup lang="ts">
import "leaflet/dist/leaflet.css";

import { LMap, LTileLayer, LMarker, LPolygon } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import { useI18n } from "vue-i18n";

import { useCityStore } from "@/stores/city-store";
import { useStreetlightStore } from "@/stores/streetlight-store";
import { useZoneStore } from "@/stores/zone-store";
import { useWasteContainerStore } from "@/stores/waste-container-store";
import { useFloodMonitoringStore } from "@/stores/flood-monitoring-store";
import { useThermostatStore } from "@/stores/thermostat-store";
import { useRouter } from "vue-router";

const { t } = useI18n();

const router = useRouter();

const cityStore = useCityStore();
const streetlightStore = useStreetlightStore();
const zoneStore = useZoneStore();
const wasteContainerStore = useWasteContainerStore();
const floodMonitoringStore = useFloodMonitoringStore();
const thermostatStore = useThermostatStore();

const dashboardMapZoom = parseInt(import.meta.env.VITE_DASHBOARD_MAP_ZOOM);
const dashboardMapCenterLatitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LATITUDE);
const dashboardMapCenterLongitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LONGITUDE);

const thermostat1DashboardPanel1Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_1_URL.replace("$customText", t("dashboard.thermostat.temperature"));
const thermostat1DashboardPanel2Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_2_URL;

const streetlightIcon = L.divIcon({
    className: "iconLeaflet",
    iconSize: [32, 32],
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#9b59b6" class="bi bi-lightbulb" viewBox="0 0 16 16"><path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/></svg>',
}) as unknown as L.Icon<L.IconOptions>;

const cityIcon = L.divIcon({
    className: "iconLeaflet",
    iconSize: [32, 32],
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f1c40f" class="bi bi-geo-alt-fill" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>',
}) as unknown as L.Icon<L.IconOptions>;

const floodMonitoringIcon = L.divIcon({
    className: "iconLeaflet",
    iconSize: [32, 32],
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#3498db" class="bi bi-water" viewBox="0 0 16 16"><path d="M.036 3.314a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 3.964a.5.5 0 0 1-.278-.65m0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 6.964a.5.5 0 0 1-.278-.65m0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 9.964a.5.5 0 0 1-.278-.65m0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65"/></svg>',
}) as unknown as L.Icon<L.IconOptions>;

const wasteContainerIcon = L.divIcon({
    className: "iconLeaflet",
    iconSize: [32, 32],
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2ecc71" class="bi bi-recycle" viewBox="0 0 16 16"><path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.5.5 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244z"/></svg>',
}) as unknown as L.Icon<L.IconOptions>;

const thermostatIcon = L.divIcon({
    className: "iconLeaflet",
    iconSize: [32, 32],
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#e74c3c" class="bi bi-thermometer-half" viewBox="0 0 16 16"><path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415"/><path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1"/></svg>',
}) as unknown as L.Icon<L.IconOptions>;

function openThermostat(thermostatId: string) {
    const thermostat = thermostatStore.getThermostat(thermostatId);
    const zone = zoneStore.getZone(thermostat.hasZone);
    router.push({ name: "responsibilities.buildings", query: { cityId: zone.hasCity, zoneId: zone.id } })
}

function openStreetlight(streetlightId: string) {
    const streetlight = streetlightStore.getStreetlight(streetlightId);
    const zone = zoneStore.getZone(streetlight.hasZone);
    router.push({ name: "responsibilities.lighting", query: { cityId: zone.hasCity, zoneId: zone.id } })
}

function openWasteContainer(wasteContainerId: string) {
    const wasteContainer = wasteContainerStore.getWasteContainer(wasteContainerId);
    const zone = zoneStore.getZone(wasteContainer.hasZone);
    router.push({ name: "responsibilities.wastecontainer", query: { cityId: zone.hasCity, zoneId: zone.id } })
}

function openFloodMonitoring(floodMonitoringId: string) {
    const floodMonitoring = floodMonitoringStore.getFloodMonitoring(floodMonitoringId);
    const zone = zoneStore.getZone(floodMonitoring.hasZone);
    router.push({ name: "responsibilities.watercourse", query: { cityId: zone.hasCity, zoneId: zone.id } })
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-md-7 col-sm-12">
                <LMap style="min-height: 40vh" :zoom="dashboardMapZoom" :center="[dashboardMapCenterLatitude, dashboardMapCenterLongitude]" :use-global-leaflet="false">
                    <LPolygon v-for="zone in zoneStore.zones" :key="zone.id" :lat-lngs="zone.coordinates" />
                    <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
                    <LMarker v-for="wasteContainer in wasteContainerStore.wasteContainers" :key="wasteContainer.id" :lat-lng="[wasteContainer.location[1], wasteContainer.location[0]]" :icon="wasteContainerIcon" @click="openWasteContainer(wasteContainer.id)" />
                    <LMarker v-for="floodMonitoring in floodMonitoringStore.floodMonitorings" :key="floodMonitoring.id" :lat-lng="[floodMonitoring.location[1], floodMonitoring.location[0]]" :icon="floodMonitoringIcon" @click="openFloodMonitoring(floodMonitoring.id)" />
                    <LMarker v-for="streetlight in streetlightStore.streetlights" :key="streetlight.id" :lat-lng="[streetlight.locationLongitude, streetlight.locationLatitude]" :icon="streetlightIcon" @click="openStreetlight(streetlight.id)" />
                    <LMarker v-for="city in cityStore.cities" :key="city.id" :lat-lng="[city.locationLongitude, city.locationLatitude]" :icon="cityIcon" />
                    <LMarker v-for="thermostat in thermostatStore.thermostats" :key="thermostat.id" :lat-lng="[thermostat.location[1], thermostat.location[0]]" :icon="thermostatIcon" @click="openThermostat(thermostat.id)" />
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
