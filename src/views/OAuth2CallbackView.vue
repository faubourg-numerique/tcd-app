<script setup lang="ts">
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

import { useCityStore } from "@/stores/city-store";
import { useMainStore } from "@/stores/main-store";
import { useStreetlightStore } from "@/stores/streetlight-store";
import { useThermostatStore } from "@/stores/thermostat-store";
import { useZoneStore } from "@/stores/zone-store";
import { useOperationStore } from "@/stores/operation-store";
import { useOperationScheduleStore } from "@/stores/operation-schedule-store";

const route = useRoute();
const router = useRouter();

const cityStore = useCityStore();
const mainStore = useMainStore();
const operationStore = useOperationStore();
const operationScheduleStore = useOperationScheduleStore();
const streetlightStore = useStreetlightStore();
const thermostatStore = useThermostatStore();
const zoneStore = useZoneStore();

async function authenticate() {
    if (!route.query.token) {
        console.error("Invalid token");
        return;
    }

    mainStore.api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            Authorization: `Bearer ${route.query.token as string}`,
        },
    });

    const response = await axios.get(import.meta.env.VITE_IDENTITY_MANAGER_URL + "/user?access_token=" + route.query.token);
    const defaultRoleNames = import.meta.env.VITE_DEFAULT_ROLE_NAMES.split(",");
    mainStore.username = response.data.username;
    mainStore.roles = response.data.roles.map((role: { name: string }) => role.name);
    mainStore.isAuthorized = !mainStore.roles.every((role) => defaultRoleNames.includes(role));

    if (!mainStore.isAuthorized) {
        mainStore.isAuthenticated = true;
        router.push({ name: "unauthorized" });
        return;
    }

    await cityStore.fetchCities();
    await operationStore.fetchOperations();
    await operationScheduleStore.fetchOperationSchedules();
    await streetlightStore.fetchStreetlights();
    await thermostatStore.fetchThermostats();
    await zoneStore.fetchZones();

    mainStore.isAuthenticated = true;

    router.push({ name: "dashboard" });
}

authenticate();
</script>

<template>
    <div id="initial-loading-screen" class="bg-white position-fixed d-flex justify-content-center w-100 h-100">
        <div class="spinner spinner-border align-self-center" />
    </div>
</template>

<style scoped>
#initial-loading-screen .spinner {
    width: 3rem;
    height: 3rem;
}
</style>
