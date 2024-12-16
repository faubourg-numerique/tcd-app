<script setup lang="ts">
import fileDownload from "js-file-download";

import { json2csv } from "json-2-csv";
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZonePicker from "@/components/CityZonePicker.vue";
import OperationParametersPicker from "@/components/OperationParametersPicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";

import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store";

const route = useRoute();

const deviceMeasurementStore = useDeviceMeasurementStore();
const deviceMeasurementRowStore = useDeviceMeasurementRowStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);

const selectedOperationId: Ref<string | null> = ref(null);
const selectedOperationParametersId: Ref<string | null> = ref(null);
    
const exportFromDate: Ref<string> = ref(new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString("en-CA"));
const exportToDate: Ref<string> = ref(new Date().toLocaleDateString("en-CA"));

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
</script>

<template>
    <div class="container">
        <CityZonePicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" class="mb-3" />
        <template v-if="selectedCityId && selectedZoneId">
            <OperationParametersPicker v-model="selectedOperationParametersId" v-model:selected-operation-id="selectedOperationId" v-model:selected-operation-parameters-id="selectedOperationParametersId" :zone-id="selectedZoneId" class="mb-3" />
            <form v-if="selectedZoneId" class="row row-cols-lg-auto g-3 align-items-center mb-3" @submit.prevent="exportData">
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
