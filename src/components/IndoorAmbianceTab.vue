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

watch(fromDateString, async () => {
    loadingData.value = true;
    fromDate.setTime(new Date(`${fromDateString.value}T00:00:00Z`).getTime());
    await loadDeviceMeasurementChartData();
    loadingData.value = false;
});

watch(toDateString, async () => {
    loadingData.value = true;
    toDate.setTime(new Date(`${toDateString.value}T23:59:59Z`).getTime());
    await loadDeviceMeasurementChartData();
    loadingData.value = false;
});

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
        label: "Moyenne du CO2",
        borderColor: "#34495e",
        backgroundColor: "#2c3e50",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.co2
        }))
    });

    datasets.push({
        label: "Moyenne de l'humidité",
        borderColor: "#3498db",
        backgroundColor: "#2980b9",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.humidity
        }))
    });

    datasets.push({
        label: "Moyenne de la température",
        borderColor: "#e74c3c",
        backgroundColor: "#c0392b",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.temperature
        }))
    });

    datasets.push({
        label: "Moyenne de la luminosité",
        borderColor: "#f1c40f",
        backgroundColor: "#f39c12",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.luminosity
        }))
    });

    datasets.push({
        label: "Moyenne du bruit",
        borderColor: "#f1c40f",
        backgroundColor: "#f39c12",
        data: deviceMeasurementRows.map((deviceMeasurementRow) => ({
            x: deviceMeasurementRow.datetime,
            y: deviceMeasurementRow.averagenoise
        }))
    });

    datasets.push({
        label: "Moyenne du taux d'occupation",
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

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(
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
    await deviceMeasurementStore.fetchDeviceMeasurements();

    const deviceMeasurements = deviceMeasurementStore.getDeviceMeasurementsByRoomIdAndMeasurementType(props.roomId, "indoor-ambiance");

    if (!deviceMeasurements.length) {
        return;
    }

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(props.roomId, "indoor-ambiance", fromDateString.value, toDateString.value);
    const deviceMeasurementRowsCleaned: any[] = [];

    const deviceMeasurementKeys = deviceMeasurements.flatMap((deviceMeasurement) =>
        Object.keys(deviceMeasurement).map((key) => key.toLowerCase())
    );

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

    const csv1 = json2csv(deviceMeasurements);
    const csv2 = json2csv(deviceMeasurementRowsCleaned);

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
                    <h1 class="modal-title fs-5">{{ deviceMeasurementRowsModalName }} ({{ deviceMeasurementRowsModalData.length }})</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-center" v-if="deviceMeasurementRowsModalLoading">
                        <div class="spinner-border"></div>
                    </div>
                    <template v-else>
                        <table class="table align-middle" v-if="deviceMeasurementRowsModalData">
                            <thead>
                                <tr>
                                    <th class="text-center">{{ $t("main.date") }}</th>
                                    <th class="text-end">{{ $t("main.temperature") }}</th>
                                    <th class="text-end">{{ $t("main.humidity") }}</th>
                                    <th class="text-end">{{ $t("main.voltage") }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(deviceMeasurementRow, index) in deviceMeasurementRowsModalData" :key="index">
                                    <td class="text-center">{{ new Date(deviceMeasurementRow.datetime).toLocaleString() }}</td>
                                    <td class="text-end">{{ deviceMeasurementRow.temperature }} °C</td>
                                    <td class="text-end">{{ deviceMeasurementRow.humidity }} %</td>
                                    <td class="text-end">{{ deviceMeasurementRow.vdd ?? "?" }} mV</td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t("main.close") }}</button>
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
