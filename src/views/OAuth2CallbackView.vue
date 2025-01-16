<script setup lang="ts">
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

import api from "@/api";
import { useAlertSettingsStore } from "@/stores/alert-settings-store";
import { useBuildingStore } from "@/stores/building-store";
import { useCityStore } from "@/stores/city-store";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useFloodMonitoringStore } from "@/stores/flood-monitoring-store";
import { useIndoorEnvironmentObservedStore } from "@/stores/indoor-environment-observed-store";
import { useMainStore } from "@/stores/main-store";
import { useOperationParametersStore } from "@/stores/operation-parameters-store";
import { useOperationScheduleStore } from "@/stores/operation-schedule-store";
import { useOperationStore } from "@/stores/operation-store";
import { useRoomStore } from "@/stores/room-store";
import { useStreetlightStore } from "@/stores/streetlight-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useThermostatStore } from "@/stores/thermostat-store";
import { useWasteContainerStore } from "@/stores/waste-container-store";
import { useZoneStore } from "@/stores/zone-store";

const route = useRoute();
const router = useRouter();

const alertSettingsStore = useAlertSettingsStore();
const buildingStore = useBuildingStore();
const cityStore = useCityStore();
const deviceMeasurementStore = useDeviceMeasurementStore();
const floodMonitoringStore = useFloodMonitoringStore();
const indoorEnvironmentObservedStore = useIndoorEnvironmentObservedStore();
const mainStore = useMainStore();
const operationParametersStore = useOperationParametersStore();
const operationScheduleStore = useOperationScheduleStore();
const operationStore = useOperationStore();
const roomStore = useRoomStore();
const streetlightStore = useStreetlightStore();
const subscriptionStore = useSubscriptionStore();
const thermostatStore = useThermostatStore();
const wasteContainerStore = useWasteContainerStore();
const zoneStore = useZoneStore();

async function main() {
    api.defaults.headers.common.Authorization = `Bearer ${route.query.token as string}`;

    const defaultRoles = import.meta.env.VITE_DEFAULT_ROLES.split(",");

    const response = await axios.get(`${import.meta.env.VITE_IDENTITY_MANAGER_URL}/user?access_token=${route.query.token}`);

    mainStore.username = response.data.username;
    mainStore.roles = response.data.roles.map((role: { name: string }) => role.name);
    mainStore.isAuthorized = !mainStore.roles.every((role: string) => defaultRoles.includes(role));

    if (!mainStore.isAuthorized) {
        mainStore.isAuthenticated = true;
        router.push({ name: "unauthorized" });
        return;
    }

    await alertSettingsStore.fetchAlertSettings();
    await buildingStore.fetchBuildings();
    await cityStore.fetchCities();
    await deviceMeasurementStore.fetchDeviceMeasurements();
    await floodMonitoringStore.fetchFloodMonitorings();
    await indoorEnvironmentObservedStore.fetchIndoorEnvironmentObserveds();
    await operationParametersStore.fetchOperationParameters();
    await operationScheduleStore.fetchOperationSchedules();
    await operationStore.fetchOperations();
    await roomStore.fetchRooms();
    await streetlightStore.fetchStreetlights();
    await subscriptionStore.fetchSubscriptions();
    await thermostatStore.fetchThermostats();
    await wasteContainerStore.fetchWasteContainers();
    await zoneStore.fetchZones();

    mainStore.isAuthenticated = true;

    router.push({ name: route.query.redirection ? route.query.redirection as string : "dashboard" });
}

main();
</script>

<template>
    <div id="loading" class="bg-white position-fixed d-flex justify-content-center w-100 h-100">
        <div class="spinner spinner-border align-self-center" />
    </div>
</template>

<style scoped>
#loading .spinner {
    width: 3rem;
    height: 3rem;
}
</style>
