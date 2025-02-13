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
import axios from "axios";
import Swal from "sweetalert2"; 


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
            <input id="grist-api-key" class="swal2-input" placeholder="Clé API Grist">
            <input id="grist-doc-id" class="swal2-input" placeholder="ID du document Grist">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Envoyer",
        preConfirm: () => {
            return {
                apiKey: document.getElementById("grist-api-key").value,
                docId: document.getElementById("grist-doc-id").value
            };
        }
    });

    if (!formValues) return; // Si l'utilisateur annule

    const { apiKey: GRIST_API_KEY, docId: GRIST_DOC_ID } = formValues;

    const GRIST_API_URL_CURRENT = `https://docs.getgrist.com/api/docs/${GRIST_DOC_ID}/tables/Current/records`;
    const GRIST_API_URL_HISTORY = `https://docs.getgrist.com/api/docs/${GRIST_DOC_ID}/tables/History/records`;

    console.log("📌 ID envoyé :", props.deviceMeasurementId);

    if (!deviceMeasurement) {
        Swal.fire("Erreur", "❌ Aucune donnée de capteur trouvée.", "error");
        return;
    }

    try {
        // ✅ Envoyer les données actuelles dans le tableau "Current"
        const responseCurrent = await axios.post(
            GRIST_API_URL_CURRENT,
            {
                records: [
                    {
                        fields: {
                            "idDevice": props.deviceMeasurementId,
                            "distance": deviceMeasurement.distance ?? null,
                            "humidity": deviceMeasurement.humidity ?? null,
                            "measurementtype": deviceMeasurement.measurementType ?? null,
                            "name": deviceMeasurement.name ?? null,
                            "pressure": deviceMeasurement.pressure ?? null,
                            "refDevice": deviceMeasurement.refDevice ?? null,
                            "temperature": deviceMeasurement.temperature ?? null,
                            "vdd": deviceMeasurement.vdd ?? null,
                        },
                    },
                ],
            },
            {
                headers: {
                    "Authorization": `Bearer ${GRIST_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ Réponse Grist (Current) :", responseCurrent.data);

        // ✅ Récupérer les données historiques
        const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRowsById(
            deviceMeasurement.id,
            fromDateString.value,
            toDateString.value
        );
        console.log("📌 Données historiques :", deviceMeasurementRows);

        if (deviceMeasurementRows.length > 0) {
            const recordsHistory = deviceMeasurementRows.map(row => ({
                fields: {
                    "idDevice": props.deviceMeasurementId,
                    "datetime": row.datetime,
                    "distance": row.distance ?? null,
                    "humidity": row.humidity ?? null,
                    "measurementtype": deviceMeasurement.measurementType ?? null,
                    "name": deviceMeasurement.name ?? null,
                    "pressure": row.pressure ?? null,
                    "refDevice": deviceMeasurement.refDevice ?? null,
                    "temperature": row.temperature ?? null,
                    "vdd": row.vdd ?? null,
                    "currentlevel": deviceMeasurement.currentLevel ?? null,
                }
            }));
            // ✅ Envoyer les données historiques dans le tableau "History"
            const responseHistory = await axios.post(
                GRIST_API_URL_HISTORY,
                { records: recordsHistory },
                {
                    headers: {
                        "Authorization": `Bearer ${GRIST_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Réponse Grist (History) :", responseHistory.data);
        } else {
            console.warn("⚠ Aucune donnée historique à envoyer.");
        }

        Swal.fire("Succès", "✅ Données envoyées à Grist avec succès !", "success");
    } catch (error) {
        console.error("❌ Erreur en envoyant les données :", error.response?.data || error.message);
        Swal.fire("Erreur", `❌ Erreur lors de l'envoi : ${error.response?.data?.error || error.message}`, "error");
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
