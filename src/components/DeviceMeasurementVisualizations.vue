<script setup lang="ts">
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

async function sendIdToGrist() {
    const { value: formValues } = await Swal.fire({
        title: "Configuration API Grist",
        html: `
            <input id="grist-api-key" class="swal2-input" placeholder="Clé API Grist" type="password">
            <input id="grist-doc-id" class="swal2-input" placeholder="ID du document Grist">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Envoyer",
        preConfirm: () => {
            return {
                apiKey: (document.getElementById("grist-api-key") as HTMLInputElement).value,
                docId: (document.getElementById("grist-doc-id") as HTMLInputElement).value
            };
        }
    });

    if (!formValues) return; // Si l'utilisateur annule

    // ✅ Met à jour toutes les valeurs dans le store
    gristStore.apiKey = formValues.apiKey;
    gristStore.docId = formValues.docId;
    gristStore.deviceMeasurementId = props.deviceMeasurementId;

    // ✅ Ajoute `fromDate` et `toDate` à partir des inputs
    gristStore.fromDate = fromDateString.value;
    gristStore.toDate = toDateString.value;

    // ✅ Envoie les données à Grist via le store
    try {
        await gristStore.sendDataToBackend();
        Swal.fire("Succès", "✅ Données envoyées à Grist avec succès !", "success");
    } catch (error) {
        console.error("❌ Erreur en envoyant les données :", error);
        console.error("❌ Message d'erreur :", gristStore.error);
        Swal.fire("Erreur", `❌ Erreur lors de l'envoi : ${error.message}`, "error");
    }
}


</script>

<template>
    <div class="mb-3">
        <div class="row row-cols-lg-auto g-3 align-items-center mb-3">
            <div class="col-12">
                <input type="date" class="form-control" v-model="fromDateString" :disabled="loadingData">
            </div>
            <div class="col-12">
                <input type="date" class="form-control" v-model="toDateString" :disabled="loadingData">
            </div>
            <div class="col-12">
                <button class="btn btn-primary" @click="loadData" :disabled="loadingData">Appliquer</button>
            </div>
        </div>
        <Line :data="deviceMeasurementChartData" :options="deviceMeasurementChartOptions" class="mb-3" />
        <button type="button" class="btn btn-primary me-3" @click="loadDeviceMeasurementChartData">{{ $t("main.refresh") }}</button>
        <button type="button" class="btn btn-primary me-3" @click="exportData">{{ $t("main.exportData") }}</button>
        <button type="button" class="btn btn-success" @click="sendIdToGrist"> {{ $t("main.EnvoieGrist") }}</button>


    </div>
</template>
