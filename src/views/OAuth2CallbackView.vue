<script setup lang="ts">
import axios from "axios";
import swal from "sweetalert2";
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

    try {
        const response = await axios.get(`${import.meta.env.VITE_IDENTITY_MANAGER_URL}/user?access_token=${route.query.token}`);

       
        mainStore.setUser({
            username: response.data.username,
            email: response.data.email,
            given_name: response.data.given_name,
            family_name: response.data.family_name,
            roles: response.data.roles
        });

        // Vérifier l'autorisation
        mainStore.isAuthorized = !mainStore.roles.every((role: string) => defaultRoles.includes(role));

        // Gestion de l'expiration du token
        const tokenExpirationDate = new Date(route.query.expires_at as string);
        tokenExpirationDate.setMinutes(tokenExpirationDate.getMinutes() - 5);
        const timeUntilSessionExpiration = tokenExpirationDate.getTime() - new Date().getTime();

        setTimeout(() => {
            swal.fire({
                allowOutsideClick: false,
                icon: "info",
                title: "Session expirée",
                text: "Votre session est expirée, veuillez vous reconnecter.",
                didClose: () => {
                    window.location.href = "/";
                }
            });
        }, timeUntilSessionExpiration);

        if (!mainStore.isAuthorized) {
            mainStore.isAuthenticated = true;
            router.push({ name: "unauthorized" });
            return;
        }

        // Charger les données depuis les autres stores
        await Promise.all([
            alertSettingsStore.fetchAlertSettings(),
            buildingStore.fetchBuildings(),
            cityStore.fetchCities(),
            deviceMeasurementStore.fetchDeviceMeasurements(),
            floodMonitoringStore.fetchFloodMonitorings(),
            indoorEnvironmentObservedStore.fetchIndoorEnvironmentObserveds(),
            operationParametersStore.fetchOperationParameters(),
            operationScheduleStore.fetchOperationSchedules(),
            operationStore.fetchOperations(),
            roomStore.fetchRooms(),
            streetlightStore.fetchStreetlights(),
            subscriptionStore.fetchSubscriptions(),
            thermostatStore.fetchThermostats(),
            wasteContainerStore.fetchWasteContainers(),
            zoneStore.fetchZones(),
        ]);

        // Authentification réussie
        mainStore.isAuthenticated = true;

        // Redirection après connexion
        router.push({ name: route.query.redirection ? route.query.redirection as string : "dashboard" });

    } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Impossible de récupérer les informations utilisateur. Veuillez réessayer.",
        });
        window.location.href = "/";
    }
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
