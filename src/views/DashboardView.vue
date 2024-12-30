<script setup lang="ts">
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useRouter } from "vue-router";

import { useCityStore } from "@/stores/city-store";
import { useFloodMonitoringStore } from "@/stores/flood-monitoring-store";
import { useIndoorEnvironmentObservedStore } from "@/stores/indoor-environment-observed-store";
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
const indoorEnvironmentObservedStore = useIndoorEnvironmentObservedStore();
const streetlightStore = useStreetlightStore();
const thermostatStore = useThermostatStore();
const wasteContainerStore = useWasteContainerStore();
const zoneStore = useZoneStore();

const cityIcon = new L.Icon({ iconSize: [16, 16], iconUrl: "/images/icons/city.svg" });
const floodMonitoringIcon = new L.Icon({ iconSize: [16, 16], iconUrl: "/images/icons/flood-monitoring.svg" });
const streetlightIcon = new L.Icon({ iconSize: [16, 16], iconUrl: "/images/icons/streetlight.svg" });
const thermostatIcon = new L.Icon({ iconSize: [16, 16], iconUrl: "/images/icons/thermostat.svg" });
const wasteContainerIcon = new L.Icon({ iconSize: [16, 16], iconUrl: "/images/icons/waste-container.svg" });
const indoorEnvironmentObservedIcon = new L.Icon({ iconSize: [16, 16], iconUrl: "/images/icons/thermostat.svg" });
</script>

<template>
    <div class="container">
        <LMap style="min-height: 60vh" :zoom="dashboardMapZoom" :center="[dashboardMapCenterLatitude, dashboardMapCenterLongitude]" :use-global-leaflet="false">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
            <!-- <LPolygon v-for="zone in zoneStore.zones" :key="zone.id" :lat-lngs="zone.location.map((location) => [location[1], location[0]])" /> -->
            <template v-for="city in cityStore.cities" :key="city.id">
                <LMarker v-if="city.location" :lat-lng="[city.location[1], city.location[0]]" :icon="cityIcon" />
            </template>
            <template v-for="wasteContainer in wasteContainerStore.wasteContainers" :key="wasteContainer.id">
                <LMarker v-if="wasteContainer.location" :lat-lng="[wasteContainer.location[1], wasteContainer.location[0]]" :icon="wasteContainerIcon" />
            </template>
            <template v-for="floodMonitoring in floodMonitoringStore.floodMonitorings" :key="floodMonitoring.id">
                <LMarker v-if="floodMonitoring.location" :lat-lng="[floodMonitoring.location[1], floodMonitoring.location[0]]" :icon="floodMonitoringIcon" />
            </template>
            <template v-for="streetlight in streetlightStore.streetlights" :key="streetlight.id">
                <LMarker v-if="streetlight.location" :lat-lng="[streetlight.location[1], streetlight.location[0]]" :icon="streetlightIcon" />
            </template>
            <template v-for="thermostat in thermostatStore.thermostats" :key="thermostat.id">
                <LMarker v-if="thermostat.location" :lat-lng="[thermostat.location[1], thermostat.location[0]]" :icon="thermostatIcon" />
            </template>
            <template v-for="indoorEnvironmentObserved in indoorEnvironmentObservedStore.indoorEnvironmentObserveds" :key="indoorEnvironmentObserved.id">
                <LMarker v-if="indoorEnvironmentObserved.location" :lat-lng="[indoorEnvironmentObserved.location[1], indoorEnvironmentObserved.location[0]]" :icon="indoorEnvironmentObservedIcon" />
            </template>
        </LMap>
    </div>
</template>
