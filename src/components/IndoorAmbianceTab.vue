<script setup lang="ts">
import "chartjs-adapter-date-fns";

import { json2csv } from "json-2-csv";
import fileDownload from "js-file-download";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend, type ChartData, type ChartOptions, type ChartDataset } from "chart.js";
import { Line } from "vue-chartjs";

import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store";
import { reactive, ref, computed, watch, onMounted, type Reactive, type Ref } from "vue";
import type { DeviceMeasurementRow } from "@/types/DeviceMeasurementRow";
import type { DeviceMeasurement } from "@/types/DeviceMeasurement";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend);

const props = defineProps<{ roomId: string }>();

const deviceMeasurementStore = useDeviceMeasurementStore();
const deviceMeasurementRowStore = useDeviceMeasurementRowStore();

const deviceMeasurementRowsModalLoading = ref(false);
const deviceMeasurementRowsModalName = ref("");
const deviceMeasurementRowsModalData: Reactive<DeviceMeasurementRow[]> = reactive([]);

const deviceMeasurements = computed(() => deviceMeasurementStore.getDeviceMeasurementsByRoomIdAndMeasurementType(props.roomId, "indoor-ambiance"));

const loadingData = ref(false);

const toDate = reactive(new Date());
const fromDate = reactive(new Date(toDate.getTime() - (3 * 24 * 60 * 60 * 1000)));

const toDateString: Ref<string> = ref(toDate.toLocaleDateString("en-CA"));
const fromDateString: Ref<string> = ref(fromDate.toLocaleDateString("en-CA"));

const datasets: Reactive<ChartDataset[]> = reactive([]);

const deviceMeasurementChartData = computed(() => ({
    datasets: JSON.parse(JSON.stringify(datasets))
}));

const deviceMeasurementChartOptions = computed(() => ({
    responsive: true,

    scales: {
        x: {
            type: "time",
            time: {
                unit: "day"
            }
        }
    }
}));

const modalChartData = computed(() => ({
    datasets: [
        {
            label: "Température (°C)",
            borderColor: "#e74c3c",
            backgroundColor: "#c0392b",
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.temperature
            }))
        },
        {
            label: "Humidité (%)",
            borderColor: "#3498db",
            backgroundColor: "#2980b9",
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.humidity
            }))
        },
        {
            label: "CO2 (ppm)",
            borderColor: "#34495e",
            backgroundColor: "#2c3e50",
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.co2
            }))
        },
        {
            label: "COVT (ug/m3)",
            borderColor: "#1abc9c",
            backgroundColor: "#16a085",
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.covt
            }))
        },
        {
            label: "Luminosité (lux)",
            borderColor: "#f1c40f",
            backgroundColor: "#f39c12",
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.luminosity
            }))
        },
        {
            label: "Bruit moyen (dB)",
            borderColor: "#bdc3c7",
            backgroundColor: "#bdc3c7",
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.averagenoise
            }))
        },
        {
            label: "Pic de bruit (dB)",
            borderColor: "#95a5a6",
            backgroundColor: "#7f8c8d",
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.peaknoise
            }))
        },
        {
            label: "Taux d'occupation (%)",
            borderColor: "#e67e22",
            backgroundColor: "#d35400",
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.occupancyrate
            }))
        }
    ]
}));

const modalChartOptions = computed(() => ({
    responsive: true,
    interaction: {
        mode: 'nearest',
        intersect: false,
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'hour',
                displayFormats: {
                    hour: 'dd/MM HH:mm'
                }
            },
            title: {
                display: true,
                text: 'Date et heure'
            }
        },
        temperature: {
            type: 'linear',
            position: 'left',
            title: {
                display: true,
                text: 'Température (°C)'
            }
        },
        humidity: {
            type: 'linear',
            position: 'right',
            title: {
                display: true,
                text: 'Humidité (%)'
            }
        }
    }
}));

async function loadData() {
    loadingData.value = true;
    fromDate.setTime(new Date(`${fromDateString.value}T00:00:00Z`).getTime());
    toDate.setTime(new Date(`${toDateString.value}T23:59:59Z`).getTime());
    await loadDeviceMeasurementChartData();
    loadingData.value = false;
}

watch(() => props.roomId, loadDeviceMeasurementChartData);
onMounted(loadDeviceMeasurementChartData);

async function loadDeviceMeasurementChartData() {
    datasets.length = 0;

    const deviceMeasurements = deviceMeasurementStore.getDeviceMeasurementsByRoomIdAndMeasurementType(props.roomId, "indoor-ambiance");

    if (!deviceMeasurements.length) {
        return;
    }

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRowsHourlyAverage(
        props.roomId,
        "indoor-ambiance",
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
    );

    datasets.push({
        label: "Température (°C)",
        borderColor: "#e74c3c",
        backgroundColor: "#c0392b",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.temperature
        }))
    });

    datasets.push({
        label: "Humidité (%)",
        borderColor: "#3498db",
        backgroundColor: "#2980b9",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.humidity
        }))
    });

    datasets.push({
        label: "CO2 (ppm)",
        borderColor: "#34495e",
        backgroundColor: "#2c3e50",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.co2
        }))
    });

    datasets.push({
        label: "COVT (ug/m3)",
        borderColor: "#1abc9c",
        backgroundColor: "#16a085",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.covt
        }))
    });

    datasets.push({
        label: "Luminosité (lux)",
        borderColor: "#f1c40f",
        backgroundColor: "#f39c12",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.luminosity
        }))
    });

    datasets.push({
        label: "Bruit moyen (dB)",
        borderColor: "#bdc3c7",
        backgroundColor: "#bdc3c7",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.averagenoise
        }))
    });

    datasets.push({
        label: "Pic de bruit (dB)",
        borderColor: "#95a5a6",
        backgroundColor: "#7f8c8d",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.peaknoise
        }))
    });

    datasets.push({
        label: "Taux d'occupation (%)",
        borderColor: "#e67e22",
        backgroundColor: "#d35400",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.occupancyrate
        }))
    });
}

async function loadDeviceMeasurementRowsModal(deviceMeasurement: DeviceMeasurement) {
    deviceMeasurementRowsModalLoading.value = true;
    deviceMeasurementRowsModalName.value = deviceMeasurement.name;
    deviceMeasurementRowsModalData.length = 0;

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchHourlyDeviceMeasurementRows(
        props.roomId,
        "indoor-ambiance",
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
    );

    deviceMeasurementRows.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    deviceMeasurementRowsModalData.push(...deviceMeasurementRows.filter((deviceMeasurementRow) => deviceMeasurementRow.id === deviceMeasurement.id));
    deviceMeasurementRowsModalLoading.value = false;
}

async function exportData() {
    const deviceMeasurements = deviceMeasurementStore.getDeviceMeasurementsByRoomIdAndMeasurementType(props.roomId, "indoor-ambiance");

    if (!deviceMeasurements.length) {
        return;
    }

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(props.roomId, "indoor-ambiance", fromDateString.value, toDateString.value);

    const rows = [];
    for (const deviceMeasurementRow of deviceMeasurementRows) {
        const row: any = {};
        for (const [key, value] of Object.entries(deviceMeasurementRow)) {
            if (value !== null && value !== undefined) {
                row[key.toLowerCase()] = value;
            }
        }
        rows.push(row);
    }

    const csv1 = json2csv(deviceMeasurements);
    const csv2 = json2csv(rows);

    fileDownload(csv1, "device-measurement-indoor-ambiance-current-export.csv");
    fileDownload(csv2, "device-measurement-indoor-ambiance-history-export.csv");
}

async function refresh() {
    await deviceMeasurementStore.fetchDeviceMeasurements();
    await loadDeviceMeasurementChartData();
}
</script>

<template>
    <div id="indoor-ambiance-device-measurement-rows-modal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">{{ deviceMeasurementRowsModalName }} </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-center" v-if="deviceMeasurementRowsModalLoading">
                        <div class="spinner-border"></div>
                    </div>
                    <template v-else>
                        <Line :data="modalChartData" :options="modalChartOptions" class="w-100" />
                    </template>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        {{ $t("main.close") }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="deviceMeasurements.length" class="table-responsive bg-white p-4 rounded border border-danger mb-3">
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
        <table class="table align-middle">
            <thead>
                <tr>
                    <th>{{ $t("main.name") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="deviceMeasurement in deviceMeasurements">
                    <td>
                        <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#indoor-ambiance-device-measurement-rows-modal" @click="loadDeviceMeasurementRowsModal(deviceMeasurement)">{{ deviceMeasurement.name }}</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <Line :data="deviceMeasurementChartData" :options="deviceMeasurementChartOptions" class="mb-3" />
        <button type="button" class="btn btn-primary me-3" @click="refresh">{{ $t("main.refresh") }}</button>
        <button type="button" class="btn btn-primary" @click="exportData">{{ $t("main.exportData") }}</button>
    </div>
    <div v-else class="alert alert-info">{{ $t("dialogs.noData") }}</div>
</template>
