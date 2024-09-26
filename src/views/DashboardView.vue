<script setup lang="ts">
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useRouter } from "vue-router";

import { useCityStore } from "@/stores/city-store";
import { useFloodMonitoringStore } from "@/stores/flood-monitoring-store";
import { useStreetlightStore } from "@/stores/streetlight-store";
import { useThermostatStore } from "@/stores/thermostat-store";
import { useWasteContainerStore } from "@/stores/waste-container-store";
import { useZoneStore } from "@/stores/zone-store";
import { LMap, LMarker, LPolygon, LTileLayer } from "@vue-leaflet/vue-leaflet";

const dashboardMapZoom = parseInt(import.meta.env.VITE_DASHBOARD_MAP_ZOOM);
const dashboardMapCenterLatitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LATITUDE);
const dashboardMapCenterLongitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LONGITUDE);

const router = useRouter();

const cityStore = useCityStore();
const floodMonitoringStore = useFloodMonitoringStore();
const streetlightStore = useStreetlightStore();
const thermostatStore = useThermostatStore();
const wasteContainerStore = useWasteContainerStore();
const zoneStore = useZoneStore();

const cityIcon = new L.Icon({ iconSize: [32, 32], iconUrl: "/images/icons/city.svg" });
const floodMonitoringIcon = new L.Icon({ iconSize: [32, 32], iconUrl: "/images/icons/flood-monitoring.svg" });
const streetlightIcon = new L.Icon({ iconSize: [32, 32], iconUrl: "/images/icons/streetlight.svg" });
const thermostatIcon = new L.Icon({ iconSize: [32, 32], iconUrl: "/images/icons/thermostat.svg" });
const wasteContainerIcon = new L.Icon({ iconSize: [32, 32], iconUrl: "/images/icons/waste-container.svg" });

function openFloodMonitoring(floodMonitoringId: string) {
    const floodMonitoring = floodMonitoringStore.getFloodMonitoring(floodMonitoringId);
    const zone = zoneStore.getZone(floodMonitoring.hasZone);
    router.push({ name: "responsibilities.watercourse", query: { cityId: zone.hasCity, zoneId: zone.id } });
}

function openStreetlight(streetlightId: string) {
    const streetlight = streetlightStore.getStreetlight(streetlightId);
    const zone = zoneStore.getZone(streetlight.hasZone);
    router.push({ name: "responsibilities.lighting", query: { cityId: zone.hasCity, zoneId: zone.id } });
}

function openThermostat(thermostatId: string) {
    const thermostat = thermostatStore.getThermostat(thermostatId);
    const zone = zoneStore.getZone(thermostat.hasZone);
    router.push({ name: "responsibilities.buildings", query: { cityId: zone.hasCity, zoneId: zone.id } });
}

function openWasteContainer(wasteContainerId: string) {
    const wasteContainer = wasteContainerStore.getWasteContainer(wasteContainerId);
    const zone = zoneStore.getZone(wasteContainer.hasZone);
    router.push({ name: "responsibilities.wastecontainer", query: { cityId: zone.hasCity, zoneId: zone.id } });
}
</script>

<template>
    <div class="container">
        <LMap style="min-height: 60vh" :zoom="dashboardMapZoom" :center="[dashboardMapCenterLatitude, dashboardMapCenterLongitude]" :use-global-leaflet="false">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
            <LPolygon v-for="zone in zoneStore.zones" :key="zone.id" :lat-lngs="zone.location.map((location) => [location[1], location[0]])" />
            <LMarker v-for="wasteContainer in wasteContainerStore.wasteContainers" :key="wasteContainer.id" :lat-lng="[wasteContainer.location[1], wasteContainer.location[0]]" :icon="wasteContainerIcon" @click="openWasteContainer(wasteContainer.id)" />
            <LMarker v-for="floodMonitoring in floodMonitoringStore.floodMonitorings" :key="floodMonitoring.id" :lat-lng="[floodMonitoring.location[1], floodMonitoring.location[0]]" :icon="floodMonitoringIcon" @click="openFloodMonitoring(floodMonitoring.id)" />
            <LMarker v-for="streetlight in streetlightStore.streetlights" :key="streetlight.id" :lat-lng="[streetlight.location[1], streetlight.location[0]]" :icon="streetlightIcon" @click="openStreetlight(streetlight.id)" />
            <LMarker v-for="city in cityStore.cities" :key="city.id" :lat-lng="[city.location[1], city.location[0]]" :icon="cityIcon" />
            <LMarker v-for="thermostat in thermostatStore.thermostats" :key="thermostat.id" :lat-lng="[thermostat.location[1], thermostat.location[0]]" :icon="thermostatIcon" @click="openThermostat(thermostat.id)" />
        </LMap>
    </div>
</template>
