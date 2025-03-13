<script setup lang="ts">
//@ts-nocheck
import "chartjs-adapter-date-fns";
import fileDownload from "js-file-download";
import { json2csv } from "json-2-csv";
import { reactive, ref, computed, watch, onMounted, type Reactive, type Ref } from "vue";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend, type ChartData, type ChartOptions, type ChartDataset } from "chart.js";
import { Line } from "vue-chartjs";
import ChartAnnotation from "chartjs-plugin-annotation";
import { useAlertSettingsStore } from "@/stores/alert-settings-store";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store";
import Swal from "sweetalert2"; 
import { useGristStore } from "@/stores/use-grist-store";
import { useMainStore } from "@/stores/main-store";
import { useUserStore } from "@/stores/user-store";

const userPreferences = ref({
    gristApiKey: "",
    gristDocId: "",
    gristBaseUrl: ""
});

const gristStore = useGristStore();

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend);
ChartJS.register(ChartAnnotation);

const props = defineProps({
    deviceMeasurementId: {
        type: String,
        required: true,
    },
});

const alertSettingsStore = useAlertSettingsStore();
const deviceMeasurementStore = useDeviceMeasurementStore();
const deviceMeasurementRowStore = useDeviceMeasurementRowStore();

const deviceMeasurement = deviceMeasurementStore.getDeviceMeasurement(props.deviceMeasurementId);

const loadingData = ref(false);

const toDate = reactive(new Date());
const fromDate = reactive(new Date());
fromDate.setMonth(fromDate.getMonth() - 1);

const toDateString: Ref<string> = ref(toDate.toLocaleDateString("en-CA"));
const fromDateString: Ref<string> = ref(fromDate.toLocaleDateString("en-CA"));

const datasets: Reactive<ChartDataset[]> = reactive([]);

const deviceMeasurementChartData = computed(() => ({
    datasets: JSON.parse(JSON.stringify(datasets))
}));

const deviceMeasurementChartOptions = computed(() => ({
    responsive: true,
    plugins: {
        annotation: {
            annotations: alertSettingsStore.getAlertSettingsByEntityId(deviceMeasurement.id).map((alertSetting) => ({
                type: "line",
                yMin: alertSetting.criteriaValue,
                yMax: alertSetting.criteriaValue,
                borderWidth: 2
            }))
        }
    },
    scales: {
        x: {
            type: "time",
            time: {
                unit: "day"
            }
        }
    }
}));

async function loadDeviceMeasurementChartData() {
    datasets.length = 0;

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRowsById(
        deviceMeasurement.id,
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
    );

    let label = "";
    let borderColor = "";
    let backgroundColor = "";

    switch (deviceMeasurement.measurementType) {
        case "waste-level": {
            label = "Niveau de remplissage (%)";
            borderColor = "#27ae60";
            backgroundColor = "#2ecc71";
            break;
        }
        case "water-level": {
            label = "Niveau d'eau (mm)";
            borderColor = "#2980b9";
            backgroundColor = "#3498db";
            break;
        }
        default: {
            return;
        }
    }

    const dataset = {
        label,
        borderColor,
        backgroundColor,
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurement.measurementType === "waste-level" ? deviceMeasurementRow.fillinglevel : deviceMeasurementRow.currentlevel,
            // y: deviceMeasurementRow.distance,
        }))
    };

    datasets.push(dataset);
}

async function exportData() {
    await deviceMeasurementStore.fetchDeviceMeasurements();

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRowsById(deviceMeasurement.id, fromDateString.value, toDateString.value);
    const deviceMeasurementRowsCleaned: any[] = [];

    const deviceMeasurementKeys = Object.keys(deviceMeasurement).map((key) => key.toLowerCase());

    for (const deviceMeasurementRow of deviceMeasurementRows) {
        const row: any = {};
        for (const [key, value] of Object.entries(deviceMeasurementRow)) {
            if (key === "datetime") {
                row[key.toLowerCase()] = value;
                continue;
            }
            if (deviceMeasurementKeys.includes(key.toLowerCase())) {
                row[key.toLowerCase()] = value;
            }
        }
        deviceMeasurementRowsCleaned.push(row);
    }

    const csv1 = json2csv([deviceMeasurement]);
    const csv2 = json2csv(deviceMeasurementRowsCleaned);

    fileDownload(csv1, "device-measurement-current-export.csv");
    fileDownload(csv2, "device-measurement-history-export.csv");
}

async function loadData() {
    loadingData.value = true;
    fromDate.setTime(new Date(`${fromDateString.value}T00:00:00Z`).getTime());
    toDate.setTime(new Date(`${toDateString.value}T23:59:59Z`).getTime());
    await loadDeviceMeasurementChartData();
    loadingData.value = false;
}

onMounted(loadDeviceMeasurementChartData);

async function fetchUserPreferences() {
    const userStore = useUserStore();
    const mainStore = useMainStore();
    if (!mainStore.user?.email) return;

    try {
        const userData = await userStore.fetchUserPreferences(mainStore.user.email);
        if (userData) {
            userPreferences.value = {
                gristApiKey: userData.gristApiKey || "",
                gristDocId: userData.gristDocId || "",
                gristBaseUrl: userData.gristBaseUrl || "https://docs.getgrist.com/api/docs"
            };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des préférences:", error);
    }
}


async function sendIdToGrist() {
    await fetchUserPreferences();

    const { value: formValues } = await Swal.fire({
    title: "Configuration API Grist",
    html: `
        <style>
            .swal2-container .swal2-html-container {
                width: 100%;
            }
            .swal2-container label {
                display: block;
                font-weight: 600;
                margin: 10px 0 5px;
                text-align: left;
            }
            .swal2-container select,
            .swal2-container input {
                width: 100%;
                padding: 8px;
                border-radius: 6px;
                border: 1px solid #ccc;
                font-size: 14px;
            }
            .swal2-container input[type="password"] {
                font-size: 16px;
            }
            .swal2-container .swal2-actions {
                margin-top: 20px;
            }
            .swal2-container .swal2-confirm {
                background-color: #6c5ce7 !important;
                border-radius: 6px;
                padding: 8px 15px;
            }
            .swal2-container .swal2-cancel {
                border-radius: 6px;
                padding: 8px 15px;
            }
        </style>

        <label for="grist-base-url">URL de base de l'API Grist</label>
        <select id="grist-base-url">
            <option value="https://docs.getgrist.com/api/docs" ${userPreferences.value.gristBaseUrl === "https://docs.getgrist.com/api/docs" ? "selected" : ""}>Grist Standard</option>
            <option value="https://grist.incubateur.anct.gouv.fr/api/docs" ${userPreferences.value.gristBaseUrl === "https://grist.incubateur.anct.gouv.fr/api/docs" ? "selected" : ""}>Grist Global / ANCT</option>
        </select>

        <label for="grist-api-key">Clé API Grist</label>
        <input id="grist-api-key" type="password" placeholder="Saisissez votre clé API Grist" value="${userPreferences.value.gristApiKey}">

        <label for="grist-doc-id">ID du document Grist</label>
        <input id="grist-doc-id" placeholder="Saisissez l'ID du document" value="${userPreferences.value.gristDocId}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Envoyer",
    preConfirm: () => {
        return {
            baseUrl: (document.getElementById("grist-base-url") as HTMLSelectElement).value,
            apiKey: (document.getElementById("grist-api-key") as HTMLInputElement).value,
            docId: (document.getElementById("grist-doc-id") as HTMLInputElement).value
        };
    }
});

    if (!formValues) return; // Si l'utilisateur annule

    // ✅ Met à jour les valeurs dans le store
    gristStore.baseUrl = formValues.baseUrl;
    gristStore.apiKey = formValues.apiKey;
    gristStore.docId = formValues.docId;
    gristStore.deviceMeasurementId = props.deviceMeasurementId;
    gristStore.fromDate = fromDateString.value;
    gristStore.toDate = toDateString.value;

    // ✅ Envoie les données à Grist via le store
    try {
        await gristStore.sendDataToBackend();
        Swal.fire("Succès", "✅ Données envoyées à Grist avec succès !", "success");
    } catch (error) {
        console.error("Erreur lors de l'envoi des données à Grist:", error);
        Swal.fire("Erreur", "❌ Échec de l'envoi des données à Grist.", "error");
    }
}



</script>

<template>
    <div class="mb-3">
        <div class="row row-cols-lg-auto g-3 align-items-center mb-3">
            <div class="col-12">
                <input v-model="fromDateString" type="date" class="form-control" :disabled="loadingData">
            </div>
            <div class="col-12">
                <input v-model="toDateString" type="date" class="form-control" :disabled="loadingData">
            </div>
            <div class="col-12">
                <button class="btn btn-primary" :disabled="loadingData" @click="loadData">Appliquer</button>
            </div>
        </div>
        <Line :data="deviceMeasurementChartData" :options="deviceMeasurementChartOptions" class="mb-3" />
        <button type="button" class="btn btn-primary me-3" @click="loadDeviceMeasurementChartData">{{ $t("main.refresh") }}</button>
        <button type="button" class="btn btn-primary me-3" @click="exportData">{{ $t("main.exportData") }}</button>
        <button type="button" class="btn btn-success" @click="sendIdToGrist"> {{ $t("main.EnvoieGrist") }}</button>


    </div>
</template>
