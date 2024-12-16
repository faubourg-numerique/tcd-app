<script setup lang="ts">
import "chartjs-adapter-date-fns";
import fileDownload from "js-file-download";

import { json2csv } from "json-2-csv";
import { nextTick, computed, reactive, useTemplateRef, ref, watch, type Reactive, type Ref } from "vue";
import { useRoute } from "vue-router";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend, type ChartData, type ChartOptions, type ChartDataset } from "chart.js";
import { Line } from "vue-chartjs";

import CityZonePicker from "@/components/CityZonePicker.vue";
import OperationParametersPicker from "@/components/OperationParametersPicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";

import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend);

const route = useRoute();

const deviceMeasurementStore = useDeviceMeasurementStore();
const deviceMeasurementRowStore = useDeviceMeasurementRowStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);

const selectedOperationId: Ref<string | null> = ref(null);
const selectedOperationParametersId: Ref<string | null> = ref(null);

const exportFromDate: Ref<string> = ref(new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString("en-CA"));
const exportToDate: Ref<string> = ref(new Date().toLocaleDateString("en-CA"));

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
        },
        y: {
            ticks: {
                stepSize: 0.2
            }
        }
    }
}));

watch(selectedZoneId, async () => {
    if (!selectedZoneId.value) {
        return;
    }

    const toDate = new Date();
    const fromDate = new Date(toDate.getTime() - (3 * 24 * 60 * 60 * 1000));

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(
        selectedZoneId.value,
        "thermostat",
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
    );

    datasets.length = 0;

    const deviceMeasurementRowById = deviceMeasurementRows.reduce((acc, row) => ((acc[row.id] = acc[row.id] || []).push(row), acc), {});
    const dates = Array.from({ length: Math.ceil((new Date() - new Date(new Date().setDate(new Date().getDate() - 3)).setHours(0, 0, 0, 0)) / 3600000) }, (_, i) => new Date(new Date(new Date().setDate(new Date().getDate() - 3)).setHours(0, 0, 0, 0) + i * 3600000));
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

    datasets.push({
        label: "Moyenne des températures aux thermostats",
        borderColor: "#e74c3c",
        backgroundColor: "#c0392b",
        data: dates.map((date, index) => ({
            x: date,
            y: averageSensorTemperature[index]
        }))
    });
});

async function exportData() {
    if (!selectedZoneId.value) {
        return;
    }

    await deviceMeasurementStore.fetchDeviceMeasurements();

    const deviceMeasurements = deviceMeasurementStore.getDeviceMeasurementsByZoneIdAndMeasurementType(selectedZoneId.value, "thermostat");

    if (!deviceMeasurements.length) {
        return;
    }

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(selectedZoneId.value, "thermostat", exportFromDate.value, exportToDate.value);
    const deviceMeasurementRowsCleaned: any[] = [];

    const deviceMeasurementKeys = deviceMeasurements.flatMap((deviceMeasurement) =>
        Object.keys(deviceMeasurement).map((key) => key.toLowerCase())
    );

    for (const deviceMeasurementRow of deviceMeasurementRows) {
        const row: any = {};
        for (const [key, value] of Object.entries(deviceMeasurementRow)) {
            if (deviceMeasurementKeys.includes(key.toLowerCase())) {
                row[key.toLowerCase()] = value;
            }
        }
        deviceMeasurementRowsCleaned.push(row);
    }

    const csv1 = json2csv(deviceMeasurements);
    const csv2 = json2csv(deviceMeasurementRowsCleaned);

    fileDownload(csv1, "device-measurement-current-export.csv");
    fileDownload(csv2, "device-measurement-history-export.csv");
}

const deviceMeasurementRowsModalLoading = ref(false);
const deviceMeasurementRowsModalName = ref("");
const deviceMeasurementRowsModalData: Reactive<DeviceMeasurementRow[]> = reactive([]);

async function loadDeviceMeasurementRowsModal(deviceMeasurement: DeviceMeasurement) {
    if (!selectedZoneId.value) {
        return;
    }

    console.log(deviceMeasurement)

    deviceMeasurementRowsModalLoading.value = true;
    deviceMeasurementRowsModalName.value = deviceMeasurement.name;
    deviceMeasurementRowsModalData.length = 0;

    const toDate = new Date();
    const fromDate = new Date(toDate.getTime() - (10 * 24 * 60 * 60 * 1000));

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(
        selectedZoneId.value,
        "thermostat",
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
    );

    deviceMeasurementRows.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    deviceMeasurementRowsModalData.push(...deviceMeasurementRows.filter((deviceMeasurementRow) => deviceMeasurementRow.id === deviceMeasurement.id));
    deviceMeasurementRowsModalLoading.value = false;
}
</script>

<template>
    <div id="device-measurement-rows-modal" class="modal fade" tabindex="-1">
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
                                    <th class="text-end">{{ $t("main.targetTemperature") }}</th>
                                    <th class="text-end">{{ $t("main.temperature") }}</th>
                                    <th class="text-end">{{ $t("main.humidity") }}</th>
                                    <th class="text-end">{{ $t("main.voltage") }}</th>
                                    <th class="text-center">{{ $t("main.lock") }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(deviceMeasurementRow, index) in deviceMeasurementRowsModalData" :key="index">
                                    <td class="text-center">{{ new Date(deviceMeasurementRow.datetime).toLocaleString() }}</td>
                                    <td class="text-end">{{ deviceMeasurementRow.targettemperature }} °C</td>
                                    <td class="text-end">{{ deviceMeasurementRow.sensortemperature }} °C</td>
                                    <td class="text-end">{{ deviceMeasurementRow.relativehumidity }} %</td>
                                    <td class="text-end">{{ deviceMeasurementRow.batteryvoltage }} V</td>
                                    <td class="text-center">{{ deviceMeasurementRow.childlock ? "ON" : "OFF" }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t("main.close")
                        }}</button>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <CityZonePicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId"
            class="mb-3" />
        <div class="table-responsive bg-white p-4 rounded border border-danger mb-3"
            v-if="selectedCityId && selectedZoneId">
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
                    <tr
                        v-for="deviceMeasurement in deviceMeasurementStore.getDeviceMeasurementsByZoneIdAndMeasurementType(selectedZoneId, 'thermostat')">
                        <td>
                            <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                data-bs-target="#device-measurement-rows-modal"
                                @click="loadDeviceMeasurementRowsModal(deviceMeasurement)">{{ deviceMeasurement.name
                                }}</button>
                        </td>
                        <td class="text-end">{{ deviceMeasurement.targetTemperature }} °C</td>
                        <td class="text-end">{{ deviceMeasurement.sensorTemperature }} °C</td>
                        <td class="text-end">{{ deviceMeasurement.relativeHumidity }} %</td>
                        <td class="text-end">{{ deviceMeasurement.batteryVoltage }} V</td>
                        <td class="text-center">{{ deviceMeasurement.childLock ? "ON" : "OFF" }}</td>
                    </tr>
                </tbody>
            </table>
            <button type="button" class="btn btn-primary" @click="deviceMeasurementStore.fetchDeviceMeasurements()">{{
                $t("main.refresh") }}</button>
        </div>
        <div class="bg-white p-4 rounded border border-danger mb-3" v-if="selectedCityId && selectedZoneId">
            <Line :data="deviceMeasurementChartData" :options="deviceMeasurementChartOptions" />
        </div>
        <template v-if="selectedCityId && selectedZoneId">
            <OperationParametersPicker v-model="selectedOperationParametersId"
                v-model:selected-operation-id="selectedOperationId"
                v-model:selected-operation-parameters-id="selectedOperationParametersId" :zone-id="selectedZoneId"
                class="mb-3" />
            <form v-if="selectedZoneId" class="row row-cols-lg-auto g-3 align-items-center mb-3"
                @submit.prevent="exportData">
                <div class="col-12">
                    <input type="date" class="form-control" v-model="exportFromDate" required>
                </div>
                <div class="col-12">
                    <input type="date" class="form-control" v-model="exportToDate" required>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary">{{ $t("main.exportData") }}</button>
                </div>
            </form>
            <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
        </template>
    </div>
</template>
