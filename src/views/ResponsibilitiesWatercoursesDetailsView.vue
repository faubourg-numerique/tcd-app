<script setup lang="ts">
import { useRoute } from "vue-router";

import DeviceMeasurementInformations from "@/components/DeviceMeasurementInformations.vue";
import DeviceMeasurementAlerts from "@/components/DeviceMeasurementAlerts.vue";
import DeviceMeasurementVisualizations from "@/components/DeviceMeasurementVisualizations.vue";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";

const route = useRoute();

const deviceMeasurementStore = useDeviceMeasurementStore();

const deviceMeasurement = deviceMeasurementStore.getDeviceMeasurement(route.params.deviceMeasurementId as string);
</script>

<template>
    <div class="container">
        <h1 class="text-center mb-4">{{ $t("main.monitoringOfWaterLevel") }}</h1>
        <div class="bg-light p-3 rounded shadow-sm">
            <DeviceMeasurementInformations :device-measurement-id="deviceMeasurement.id" />
            <DeviceMeasurementVisualizations :device-measurement-id="deviceMeasurement.id" />
            <DeviceMeasurementAlerts :device-measurement-id="deviceMeasurement.id" />
        </div>
    </div>
</template>
