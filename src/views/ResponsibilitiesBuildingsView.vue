<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { useThermostatStore } from "@/stores/thermostat-store";

const { t } = useI18n();

const thermostatStore = useThermostatStore();

async function updateThermostatTemperature(thermostatId: string) {
    const thermostat = thermostatStore.getThermostat(thermostatId);
    const data = {
        value: thermostat.temperature
    };
    await thermostatStore.updateThermostat(thermostatId, data);
}

const thermostat1DashboardPanel1Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_1_URL.replace("$customText", t("dashboard.thermostat.temperature"));
const thermostat1DashboardPanel2Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_2_URL;
const thermostat1DashboardPanel3Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_3_URL.replace("$customText", t("dashboard.thermostat.temperature"));
const thermostat1DashboardPanel4Url = import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_4_URL.replace("$customText", t("dashboard.thermostat.electricity"));
</script>

<template>
    <div class="container-fluid mt-4">
        <div class="row">
            <div v-for="thermostat in thermostatStore.thermostats" :key="thermostat.id" class="form-thermostat-container col-md mt-3 mb-3 w-100">
                <form class="container border border-danger rounded d-flex flex-column align-items-center h-100" @submit.prevent="updateThermostatTemperature(thermostat.id)">
                    <div class="mb-3 w-50 form-group">
                        <label for="temperature" class="form-label">Temperature</label>
                        <input id="temperature" v-model="thermostat.temperature" type="number" min="-20" max="60" step="0.1" placeholder="Temperature" required class="form-control"/>
                    </div>
                    <div class="mb-3 w-50 text-center form-group">
                        <p class="text-danger">{{ thermostat.name }}</p>
                        <input type="submit" class="btn btn-primary mt-auto"/>
                    </div>
                </form>
            </div>
            <div class="rounded col-md mt-3 mb-3 container-iframe-thermostat w-100">
                <iframe class="w-100 h-100 rounded border border-danger h-100" :src="thermostat1DashboardPanel2Url" frameborder="0"/>
            </div>
            <div class="rounded col-md mt-3 mb-3 container-iframe-thermostat w-100">
                <iframe class="w-100 h-100 rounded border border-danger h-100" :src="thermostat1DashboardPanel3Url" frameborder="0"/>
            </div>
            <div class="rounded col-md mt-3 mb-3 container-iframe-thermostat w-100">
                <iframe class="w-100 h-100 rounded border border-danger h-100" :src="thermostat1DashboardPanel1Url" frameborder="0"/>
            </div>
            <div class="rounded col-md mt-3 mb-3 container-iframe-thermostat w-100">
                <iframe class="w-100 h-100 rounded border border-danger h-100" :src="thermostat1DashboardPanel4Url" frameborder="0"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form-thermostat-container {
    min-width: 300px;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.container-iframe-thermostat {
    min-width: 300px;
    min-height: 30vh;
}
</style>
