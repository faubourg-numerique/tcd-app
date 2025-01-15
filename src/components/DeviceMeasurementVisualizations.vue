<script setup lang="ts">
import "chartjs-adapter-date-fns";

import { reactive, ref, computed, watch, onMounted, type Reactive, type Ref } from "vue";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend, type ChartData, type ChartOptions, type ChartDataset } from "chart.js";
import { Line } from "vue-chartjs";

import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend);

const props = defineProps({
    deviceMeasurementId: {
        type: String,
        required: true,
    },
});

const deviceMeasurementStore = useDeviceMeasurementStore();
const deviceMeasurementRowStore = useDeviceMeasurementRowStore();

const deviceMeasurement = deviceMeasurementStore.getDeviceMeasurement(props.deviceMeasurementId);

const toDate = reactive(new Date());
const fromDate = reactive(new Date(toDate.getTime() - (3 * 24 * 60 * 60 * 1000)));

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

    switch(deviceMeasurement.measurementType) {
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
            // y: deviceMeasurementRow.measurementType === "waste-level" ? deviceMeasurementRow.fillinglevel : deviceMeasurementRow.currentlevel
            y: deviceMeasurementRow.distance
        }))
    };

    datasets.push(dataset);
}

onMounted(loadDeviceMeasurementChartData);
</script>

<template>
    <h2>{{ $t("main.visualization") }}</h2>
    <Line :data="deviceMeasurementChartData" :options="deviceMeasurementChartOptions" class="mb-3" />
</template>
