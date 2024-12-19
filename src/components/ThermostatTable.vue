<script setup lang="ts">
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store";
import { reactive, ref, type Reactive } from "vue";
import type { DeviceMeasurementRow } from "@/types/DeviceMeasurementRow";
import type { DeviceMeasurement } from "@/types/DeviceMeasurement";

const props = defineProps<{ zoneId: string }>();

const deviceMeasurementStore = useDeviceMeasurementStore();
const deviceMeasurementRowStore = useDeviceMeasurementRowStore();

const deviceMeasurementRowsModalLoading = ref(false);
const deviceMeasurementRowsModalName = ref("");
const deviceMeasurementRowsModalData: Reactive<DeviceMeasurementRow[]> = reactive([]);

async function loadDeviceMeasurementRowsModal(deviceMeasurement: DeviceMeasurement) {
    console.log(deviceMeasurement)

    deviceMeasurementRowsModalLoading.value = true;
    deviceMeasurementRowsModalName.value = deviceMeasurement.name;
    deviceMeasurementRowsModalData.length = 0;

    const toDate = new Date();
    const fromDate = new Date(toDate.getTime() - (10 * 24 * 60 * 60 * 1000));

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(
        props.zoneId,
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
    <div id="thermostat-device-measurement-rows-modal" class="modal fade" tabindex="-1">
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

    <div class="table-responsive bg-white p-4 rounded border border-danger mb-3">
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
                    v-for="deviceMeasurement in deviceMeasurementStore.getDeviceMeasurementsByZoneIdAndMeasurementType(props.zoneId, 'thermostat')">
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
        <button type="button" class="btn btn-primary" @click="deviceMeasurementStore.fetchDeviceMeasurements()">{{ $t("main.refresh") }}</button>
    </div>
</template>
