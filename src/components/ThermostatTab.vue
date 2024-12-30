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

const deviceMeasurements = computed(() => deviceMeasurementStore.getDeviceMeasurementsByRoomIdAndMeasurementType(props.roomId, "thermostat"));

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

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(
        props.roomId,
        "thermostat",
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
    );

    const deviceMeasurementRowById = deviceMeasurementRows.reduce((acc, row) => ((acc[row.id] = acc[row.id] || []).push(row), acc), {});

    const dates = Array.from(
        { length: Math.ceil((toDate.getTime() - fromDate.getTime()) / 3600000) },
        (_, i) => new Date(fromDate.getTime() + i * 3600000)
    );

    const data = {};

    for (const deviceMeasurementId of Object.keys(deviceMeasurementRowById)) {
        data[deviceMeasurementId] = dates.map((date) => {
            const targetTime = new Date(date).getTime();
            return deviceMeasurementRows.reduce((closest, current) => {
                const currentTime = current.datetime ? new Date(current.datetime).getTime() : Infinity;
                const closestTime = closest.datetime ? new Date(closest.datetime).getTime() : Infinity;
                return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime) ? current : closest;
            }, { datetime: null });
        });
    }

    const averageSensorTemperature = dates.map((date, index) => {
        const temperaturesForDate = Object.keys(data).map(deviceMeasurementId => {
            const deviceMeasurement = data[deviceMeasurementId][index];
            return deviceMeasurement ? deviceMeasurement.sensortemperature : null;
        }).filter((temp) => temp != null);

        return temperaturesForDate.length > 0 ? temperaturesForDate.reduce((sum, temp) => sum + temp, 0) / temperaturesForDate.length : null;
    });

    const averageRelativeHumidity = dates.map((date, index) => {
        const relativeHumiditiesForDate = Object.keys(data).map(deviceMeasurementId => {
            const deviceMeasurement = data[deviceMeasurementId][index];
            return deviceMeasurement ? deviceMeasurement.relativehumidity : null;
        }).filter((temp) => temp != null);

        return relativeHumiditiesForDate.length > 0 ? relativeHumiditiesForDate.reduce((sum, temp) => sum + temp, 0) / relativeHumiditiesForDate.length : null;
    });

    datasets.push({
        label: "Moyenne de la température",
        borderColor: "#e74c3c",
        backgroundColor: "#c0392b",
        data: dates.map((date, index) => ({
            x: date,
            y: averageSensorTemperature[index]
        }))
    });

    datasets.push({
        label: "Moyenne de l'humidité",
        borderColor: "#3498db",
        backgroundColor: "#2980b9",
        data: dates.map((date, index) => ({
            x: date,
            y: averageRelativeHumidity[index]
        }))
    });
}



async function loadDeviceMeasurementRowsModal(deviceMeasurement: DeviceMeasurement) {
    deviceMeasurementRowsModalLoading.value = true;
    deviceMeasurementRowsModalName.value = deviceMeasurement.name;
    deviceMeasurementRowsModalData.length = 0;

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchHourlyDeviceMeasurementRows(
        props.roomId,
        "thermostat",
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
    );

    deviceMeasurementRows.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    deviceMeasurementRowsModalData.push(...deviceMeasurementRows.filter((deviceMeasurementRow) => deviceMeasurementRow.id === deviceMeasurement.id));
    deviceMeasurementRowsModalLoading.value = false;
}

const modalChartData = computed(() => ({
    datasets: [
        {
            label: 'Température',
            borderColor: '#e74c3c',
            backgroundColor: '#c0392b',
            yAxisID: 'temperature',
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.avg_temp
            }))
        },
        {
            label: 'Humidité',
            borderColor: '#3498db',
            backgroundColor: '#2980b9',
            yAxisID: 'humidity',
            data: deviceMeasurementRowsModalData.map(row => ({
                x: new Date(row.hour),
                y: row.avg_humidity
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

async function exportData() {
    await deviceMeasurementStore.fetchDeviceMeasurements();

    const deviceMeasurements = deviceMeasurementStore.getDeviceMeasurementsByRoomIdAndMeasurementType(props.roomId, "thermostat");

    if (!deviceMeasurements.length) {
        return;
    }

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(props.roomId, "thermostat", fromDateString.value, toDateString.value);
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

    fileDownload(csv1, "device-measurement-thermostat-current-export.csv");
    fileDownload(csv2, "device-measurement-thermostat-history-export.csv");
}

</script>

<template>
    <div id="thermostat-device-measurement-rows-modal" class="modal fade" tabindex="-1">
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
                            <Line
                                :data="modalChartData"
                                :options="modalChartOptions"
                            />
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
        </div>
        <table class="table align-middle">
            <thead>
                <tr>
                    <th>{{ $t("main.name") }}</th>
                    <th class="text-end">{{ $t("main.targetTemperature") }}</th>
                    <th class="text-end">{{ $t("main.temperature") }}</th>
                    <th class="text-end">{{ $t("main.humidity") }}</th>
                    <th class="text-end">{{ $t("main.voltage") }}</th>
                    <th class="text-center">{{ $t("main.lock") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="deviceMeasurement in deviceMeasurements">
                    <td>
                        <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#thermostat-device-measurement-rows-modal" @click="loadDeviceMeasurementRowsModal(deviceMeasurement)">{{ deviceMeasurement.name }}</button>
                    </td>
                    <td class="text-end">{{ deviceMeasurement.targetTemperature }} °C</td>
                    <td class="text-end">{{ deviceMeasurement.sensorTemperature }} °C</td>
                    <td class="text-end">{{ deviceMeasurement.relativeHumidity }} %</td>
                    <td class="text-end">{{ deviceMeasurement.batteryVoltage }} V</td>
                    <td class="text-center">{{ deviceMeasurement.childLock ? "ON" : "OFF" }}</td>
                </tr>
            </tbody>
        </table>
        <Line :data="deviceMeasurementChartData" :options="deviceMeasurementChartOptions" class="mb-3" />
        <button type="button" class="btn btn-primary me-3" @click="deviceMeasurementStore.fetchDeviceMeasurements()">{{ $t("main.refresh") }}</button>
        <button type="button" class="btn btn-primary" @click="exportData">{{ $t("main.exportData") }}</button>
    </div>
    <div v-else class="alert alert-info">{{ $t("dialogs.noData") }}</div>
</template>
