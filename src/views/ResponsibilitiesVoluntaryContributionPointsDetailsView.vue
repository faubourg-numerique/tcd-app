<script setup lang="ts">
import { useRoute } from "vue-router";

import DeviceMeasurementAlerts from "@/components/DeviceMeasurementAlerts.vue";
import DeviceMeasurementInformations from "@/components/DeviceMeasurementInformations.vue";
import DeviceMeasurementVisualizations from "@/components/DeviceMeasurementVisualizations.vue";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";

const route = useRoute();

const deviceMeasurementStore = useDeviceMeasurementStore();

const deviceMeasurement = deviceMeasurementStore.getDeviceMeasurement(route.params.deviceMeasurementId as string);
</script>

<template>
    <div class="container">
        <h1 class="text-center mb-4">{{ $t("main.monitoringOfVoluntaryContributionPoints") }}</h1>
        <div class="bg-light p-3 rounded shadow-sm">
            <dl class="row">
                <dt class="col-sm-3">{{ $t("main.name") }}</dt>
                <dd class="col-sm-9">{{ deviceMeasurement.name }}</dd>
                <dt class="col-sm-3">{{ $t("main.fillingLevel") }}</dt>
                <dd class="col-sm-9">{{ deviceMeasurement.fillingLevel ? Math.floor(deviceMeasurement.fillingLevel) : "N/A" }} %</dd>
            </dl>
            <DeviceMeasurementAlerts :device-measurement-id="deviceMeasurement.id" />
            <DeviceMeasurementVisualizations :device-measurement-id="deviceMeasurement.id" />
        </div>
    </div>
</template>
