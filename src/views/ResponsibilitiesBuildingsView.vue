<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, type Reactive, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZoneBuildingRoomPicker from "@/components/CityZoneBuildingRoomPicker.vue";
import OperationParametersPicker from "@/components/OperationParametersPicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";
import ThermostatTab from "@/components/ThermostatTab.vue";
import IndoorAmbianceTab from "@/components/IndoorAmbianceTab.vue";

import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store";

const route = useRoute();

const deviceMeasurementStore = useDeviceMeasurementStore();
const deviceMeasurementRowStore = useDeviceMeasurementRowStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);
const selectedBuildingId: Ref<string | null> = ref((route.query.building as string) ?? null);
const selectedRoomId: Ref<string | null> = ref((route.query.roomId as string) ?? null);

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
        mode: 'index',
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

    deviceMeasurementRowsModalLoading.value = true;
    deviceMeasurementRowsModalName.value = deviceMeasurement.name;
    deviceMeasurementRowsModalData.length = 0;

    const toDate = new Date();
    const fromDate = new Date(toDate.getTime() - (10 * 24 * 60 * 60 * 1000));

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchHourlyDeviceMeasurementRows(
        selectedZoneId.value,
        "thermostat",
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
    );
    console.log(deviceMeasurementRows);

    deviceMeasurementRows.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    deviceMeasurementRowsModalData.push(...deviceMeasurementRows.filter((deviceMeasurementRow) => deviceMeasurementRow.id === deviceMeasurement.id));
    deviceMeasurementRowsModalLoading.value = false;
}

</script>

<template>
    <div class="container">
        <CityZoneBuildingRoomPicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" v-model:selected-building-id="selectedBuildingId" v-model:selected-room-id="selectedRoomId" class="mb-3" />

        <template v-if="selectedCityId && selectedZoneId && selectedBuildingId && selectedRoomId">
            <!-- <OperationParametersPicker v-model="selectedOperationParametersId" v-model:selected-operation-id="selectedOperationId" v-model:selected-operation-parameters-id="selectedOperationParametersId" :zone-id="selectedZoneId" class="mb-3" /> -->

            <ul id="pills-tab" class="nav nav-pills mb-3">
                <li class="nav-item">
                    <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#pills-thermostat">{{ $t("main.heating") }}</button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#pills-indoor-ambiance">{{ $t("main.ambiance") }}</button>
                </li>
            </ul>
            <div class="tab-content">
                <div id="pills-thermostat" class="tab-pane show active" tabindex="0">
                    <ThermostatTab :room-id="selectedRoomId"></ThermostatTab>
                </div>
                <div id="pills-indoor-ambiance" class="tab-pane" tabindex="0">
                    <IndoorAmbianceTab :room-id="selectedRoomId"></IndoorAmbianceTab>
                </div>
            </div>

            <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
        </template>
    </div>
</template>
