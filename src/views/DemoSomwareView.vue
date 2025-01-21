<script setup lang="ts">
import swal from "sweetalert2";

import { computed, reactive, ref, watch, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "vue-chartjs";

import { useDemoStore } from "@/stores/demo-store";
import { useOperationStore } from "@/stores/operation-store";
// import { demoWebSocketClient } from "@/web-socket-clients/demo-web-socket-client";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const demoStore = useDemoStore();
const operationStore = useOperationStore();

const { t } = useI18n();

async function runOperation(operationParametersId: string) {
    try {
        waitingForAck.value = true;
        await operationStore.runOperation(operationParametersId);
    } catch (error) {
        waitingForAck.value = false;
        await swal.fire({
            icon: "error",
            title: t("dialogs.operationRunErrorTitle"),
            text: t("dialogs.operationRunErrorText"),
        });
        return;
    }
}

const sessionEndDate = new Date();
sessionEndDate.setMinutes(sessionEndDate.getMinutes() + 10);

const sessionInterval = setInterval(() => {
    const date = new Date();
    if (date > sessionEndDate) {
        clearInterval(sessionInterval);
        demoWebSocketClient.close();

        swal.fire({
            showConfirmButton: false,
            allowOutsideClick: false,
            icon: "info",
            title: "Session terminée",
            text: "Cette session est terminée, veuillez scanner de nouveau le QR code pour en obtenir une nouvelle. Vous pouvez fermer cette page."
        });
    }
}, 1000);

const floodMonitoringCurrentLevelThreshold = 70;
const wasteContainerFillingLevelThreshold = 0.70;

const waitingForAck: Ref<boolean> = ref(false);
const waitingForAlert: Ref<boolean> = ref(false);

const defaultFloodMonitoringEntityId = "urn:ngsi-ld:FloodMonitoring:1af130d3-7bbf-4752-a5f0-ad49cfc1422a";
const defaultThermostatEntityId = "urn:ngsi-ld:Thermostat:96f3b908-3ef2-4dd2-b409-da4e2c372374";
const defaultStreetlightEntityId = "urn:ngsi-ld:Streetlight:3cf08def-f0fd-4e94-9ae9-2c09393c4e8c";
const wasteContainer1EntityId = "urn:ngsi-ld:WasteContainer:18f65f44-7212-4c69-bdf2-dc5abc4a2cce";
const wasteContainer2EntityId = "urn:ngsi-ld:WasteContainer:1cdc0946-cd0f-4acc-b81d-a506f3a40b83";

const floodMonitoringCurrentLevelChartData = computed(() => ({
    labels: demoStore.floodMonitoringCurrentLevelHistory.filter((element) => element.id === defaultFloodMonitoringEntityId).map((element) => element.date.toLocaleTimeString()),
    datasets: [
        {
            label: "Cours d'eau",
            backgroundColor: "#3498db",
            data: demoStore.floodMonitoringCurrentLevelHistory.filter((element) => element.id === defaultFloodMonitoringEntityId).map((element) => element.value)
        }
    ]
}));

const floodMonitoringCurrentLevelChartOptions = computed(() => ({
    responsive: true,
    scales: {
        y: {
            min: 0,
            max: 100,
            ticks: {
                callback: function (value: any) {
                    return value + "%";
                }
            }
        }
    }
}));

const thermostatTargetTemperatureChartData = computed(() => ({
    labels: demoStore.thermostatTargetTemperatureHistory.filter((element) => element.id === defaultThermostatEntityId).map((element) => element.date.toLocaleTimeString()),
    datasets: [
        {
            label: "Température cible",
            backgroundColor: "#e74c3c",
            data: demoStore.thermostatTargetTemperatureHistory.filter((element) => element.id === defaultThermostatEntityId).map((element) => element.value)
        }
    ]
}));

const thermostatTargetTemperatureChartOptions = computed(() => ({
    responsive: true,
    scales: {
        y: {
            min: 16,
            max: 24,
            ticks: {
                callback: function (value: any) {
                    return value + "°C";
                }
            }
        }
    }
}));

const wasteContainer1ChartData = computed(() => ({
    labels: demoStore.wasteContainerFillingLevelHistory.filter((element) => element.id === wasteContainer1EntityId).map((element) => element.date.toLocaleTimeString()),
    datasets: [
        {
            label: "Conteneur à déchêts",
            backgroundColor: "#2ecc71",
            data: demoStore.wasteContainerFillingLevelHistory.filter((element) => element.id === wasteContainer1EntityId).map((element) => Math.floor(element.value * 100))
        }
    ]
}));

const wasteContainer1ChartOptions = computed(() => ({
    responsive: true,
    scales: {
        y: {
            min: 0,
            max: 100,
            ticks: {
                callback: function (value: any) {
                    return value + "%";
                }
            }
        }
    }
}));

const wasteContainer2ChartData = computed(() => ({
    labels: demoStore.wasteContainerFillingLevelHistory.filter((element) => element.id === wasteContainer2EntityId).map((element) => element.date.toLocaleTimeString()),
    datasets: [
        {
            label: "Conteneur à verre",
            backgroundColor: "#f1c40f",
            data: demoStore.wasteContainerFillingLevelHistory.filter((element) => element.id === wasteContainer2EntityId).map((element) => Math.floor(element.value * 100))
        }
    ]
}));

const wasteContainer2ChartOptions = computed(() => ({
    responsive: true,
    scales: {
        y: {
            min: 0,
            max: 100,
            ticks: {
                callback: function (value: any) {
                    return value + "%";
                }
            }
        }
    }
}));

watch(() => demoStore.lastMessageTime, () => {
    waitingForAck.value = false;
});

watch(demoStore.floodMonitoringCurrentLevel, (floodMonitoringCurrentLevel) => {
    for (const currentLevel of Object.values(floodMonitoringCurrentLevel)) {
        if (currentLevel >= floodMonitoringCurrentLevelThreshold) {
            waitingForAlert.value = true;
            setTimeout(async () => {
                waitingForAlert.value = false;
                await swal.fire({
                    showConfirmButton: true,
                    allowOutsideClick: false,
                    icon: "warning",
                    title: "Alerte!",
                    html: `Le niveau du cours d'eau (${currentLevel}%) a dépassé le seuil d'alerte (${floodMonitoringCurrentLevelThreshold}%).<br>Déclenchement de l'ouverture des vannes...`
                });

                runOperation("urn:ngsi-ld:OperationParameters:3fc14568-5693-4d9b-8380-eee3eab0c8ce");
            }, 1000);
        }
    }
});

watch(demoStore.wasteContainerFillingLevel, (wasteContainerFillingLevel) => {
    for (const fillingLevel of Object.values(wasteContainerFillingLevel)) {
        if (fillingLevel >= wasteContainerFillingLevelThreshold) {
            waitingForAlert.value = true;
            setTimeout(() => {
                waitingForAlert.value = false;
                swal.fire({
                    showConfirmButton: true,
                    allowOutsideClick: false,
                    icon: "warning",
                    title: "Alerte!",
                    html: `Le niveau de remplissage d'un point d'apport volontaire (${Math.floor(fillingLevel * 100)}%) a dépassé le seuil d'alerte (${Math.floor(wasteContainerFillingLevelThreshold * 100)}%).<br>Déclenchement de la collecte des déchêts...`
                });
            }, 1000);
        }
    }
});
</script>

<template>
    <div class="container">
        <div class="row mt-3 mb-5">
            <div class="col text-center">
                <img style="height: 80px;" alt="Somme Numérique" src="@/assets/images/logos/somme-numerique-2.png" />
            </div>
            <div class="col text-center">
                <img style="height: 80px;" alt="Somme Numérique" src="@/assets/images/logos/faubourg-numerique.png" />
            </div>
        </div>
        <div class="mb-5">
            <p class="h5 mb-3">💧 Cours d'eau<span
                    v-if="defaultFloodMonitoringEntityId in demoStore.floodMonitoringCurrentLevel"
                    class="fw-bold ms-3">{{ demoStore.floodMonitoringCurrentLevel[defaultFloodMonitoringEntityId]
                    }}%</span></p>
            <p class="text-danger">Seuil d'alerte: {{ floodMonitoringCurrentLevelThreshold }}%</p>
            <div class="row row-cols-5">
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:e5debc5c-95a5-4b3a-81de-ddc568b0d289')"
                        :disabled="waitingForAck || waitingForAlert">0%</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:3fc14568-5693-4d9b-8380-eee3eab0c8ce')"
                        :disabled="waitingForAck || waitingForAlert">25%</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:93d0ac43-0c73-4851-9262-e37b444c9d12')"
                        :disabled="waitingForAck || waitingForAlert">50%</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:b98d6233-7886-4a3d-89c4-580880b81eff')"
                        :disabled="waitingForAck || waitingForAlert">75%</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:f6ebdbc9-4f4e-4224-9430-d42454e695c9')"
                        :disabled="waitingForAck || waitingForAlert">100%</button>
                </div>
            </div>
        </div>
        <div class="mb-5">
            <p class="h5 mb-3">💡 Éclairage<span v-if="defaultStreetlightEntityId in demoStore.streetlightPowerState"
                    class="fw-bold ms-3">{{ demoStore.streetlightPowerState[defaultStreetlightEntityId] === "on" ? "ON"
                        : "OFF"
                    }}</span></p>
            <div class="row row-cols-2">
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:209d923c-7cba-4e33-a9a3-e6271ea293cd')"
                        :disabled="waitingForAck || waitingForAlert">Allumer</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:9138a00b-4341-464a-962a-bce328b6729d')"
                        :disabled="waitingForAck || waitingForAlert">Éteindre</button>
                </div>
            </div>
        </div>
        <div class="mb-5">
            <p class="h5 mb-3">♻️ Points d'apport volontaires</p>
            <p class="text-danger">Seuil d'alerte: {{ Math.floor(wasteContainerFillingLevelThreshold * 100) }}%</p>
            <div class="row row-cols-2">
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:bbddea53-d46b-4a20-af95-ea16b64341de')"
                        :disabled="waitingForAck || waitingForAlert">Sac poubelle</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:a0a0bce5-b328-4a4a-b077-6c343e5b1a2e')"
                        :disabled="waitingForAck || waitingForAlert">Bouteille en verre</button>
                </div>
            </div>
        </div>
        <div class="mb-5">
            <p class="h5 mb-3">🔥 Chauffage<span
                    v-if="defaultThermostatEntityId in demoStore.thermostatTargetTemperature" class="fw-bold ms-3">{{
                        demoStore.thermostatTargetTemperature[defaultThermostatEntityId] }}°C</span>
            </p>
            <div class="row row-cols-5">
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:5f274063-2b25-4b3e-9141-a3762a712e18')"
                        :disabled="waitingForAck || waitingForAlert">16°</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:d66dae3d-ac99-40de-ba62-2bc7e93d1694')"
                        :disabled="waitingForAck || waitingForAlert">18°</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:e2d73877-4cc1-4bcf-aa6e-313202ad6bfc')"
                        :disabled="waitingForAck || waitingForAlert">20°</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:0abdecdc-4d27-49c7-83b3-4eeb79540c75')"
                        :disabled="waitingForAck || waitingForAlert">22°</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100"
                        @click="runOperation('urn:ngsi-ld:OperationParameters:e68ab292-cea8-4835-a6f2-c29dce25aa64')"
                        :disabled="waitingForAck || waitingForAlert">24°</button>
                </div>
            </div>
        </div>
        <hr>
        <p class="h5 mb-3">Historique</p>
        <Line :data="floodMonitoringCurrentLevelChartData" :options="floodMonitoringCurrentLevelChartOptions"
            class="mb-3" />
        <Line :data="thermostatTargetTemperatureChartData" :options="thermostatTargetTemperatureChartOptions"
            class="mb-3" />
        <Line :data="wasteContainer1ChartData" :options="wasteContainer1ChartOptions" class="mb-3" />
        <Line :data="wasteContainer2ChartData" :options="wasteContainer2ChartOptions" class="mb-3" />
    </div>
</template>
