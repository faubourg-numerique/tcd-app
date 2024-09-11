<script setup lang="ts">
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";

const props = defineProps({
    deviceMeasurementId: {
        type: String,
        required: true
    }
});

const deviceMeasurementStore = useDeviceMeasurementStore();

const deviceMeasurement = deviceMeasurementStore.getDeviceMeasurement(props.deviceMeasurementId);
</script>

<template>
    <dl class="row">
        <dt class="col-sm-3">{{ $t("name") }}</dt>
        <dd class="col-sm-9">{{ deviceMeasurement.name }}</dd>
        <dt class="col-sm-3">{{ $t("distance") }}</dt>
        <dd class="col-sm-9">{{ deviceMeasurement.distance ?? "N/A" }}</dd>
    </dl>
</template>
