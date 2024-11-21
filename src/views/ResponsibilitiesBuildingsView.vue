<script setup lang="ts">
import fileDownload from "js-file-download";

import { json2csv } from "json-2-csv";
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZonePicker from "@/components/CityZonePicker.vue";
import OperationParametersPicker from "@/components/OperationParametersPicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";

import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store.ts";

const route = useRoute();

const deviceMeasurementRowStore = useDeviceMeasurementRowStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);

const selectedOperationId: Ref<string | null> = ref(null);
const selectedOperationParametersId: Ref<string | null> = ref(null);

async function exportData() {
    if (!selectedZoneId.value) {
        return;
    }

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(selectedZoneId.value, "thermostat");
    const csv = json2csv(deviceMeasurementRows);
    fileDownload(csv, "export.csv");
}
</script>

<template>
    <div class="container">
        <CityZonePicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" class="mb-3" />
        <template v-if="selectedCityId && selectedZoneId">
            <OperationParametersPicker v-model="selectedOperationParametersId" v-model:selected-operation-id="selectedOperationId" v-model:selected-operation-parameters-id="selectedOperationParametersId" :zone-id="selectedZoneId" class="mb-3" />
            <div v-if="selectedZoneId" class="mb-3">
                <button type="button" class="btn btn-primary" @click="exportData">{{ $t("main.exportData") }}</button>
            </div>
            <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
        </template>
    </div>
</template>
