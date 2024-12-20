<script setup lang="ts">
import { json2csv } from "json-2-csv";
import fileDownload from "js-file-download";

import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store";
import { reactive, ref, computed, type Reactive, type Ref } from "vue";
import type { DeviceMeasurementRow } from "@/types/DeviceMeasurementRow";
import type { DeviceMeasurement } from "@/types/DeviceMeasurement";

const props = defineProps<{ roomId: string }>();

const deviceMeasurementStore = useDeviceMeasurementStore();
const deviceMeasurementRowStore = useDeviceMeasurementRowStore();

const deviceMeasurementRowsModalLoading = ref(false);
const deviceMeasurementRowsModalName = ref("");
const deviceMeasurementRowsModalData: Reactive<DeviceMeasurementRow[]> = reactive([]);

const deviceMeasurements = computed(() => deviceMeasurementStore.getDeviceMeasurementsByRoomIdAndMeasurementType(props.roomId, "indoor-ambiance"));

const exportFromDate: Ref<string> = ref(new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString("en-CA"));
const exportToDate: Ref<string> = ref(new Date().toLocaleDateString("en-CA"));

async function loadDeviceMeasurementRowsModal(deviceMeasurement: DeviceMeasurement) {
    console.log(deviceMeasurement)

    deviceMeasurementRowsModalLoading.value = true;
    deviceMeasurementRowsModalName.value = deviceMeasurement.name;
    deviceMeasurementRowsModalData.length = 0;

    const toDate = new Date();
    const fromDate = new Date(toDate.getTime() - (10 * 24 * 60 * 60 * 1000));

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(
        props.roomId,
        "indoor-ambiance",
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
    );

    deviceMeasurementRows.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    deviceMeasurementRowsModalData.push(...deviceMeasurementRows.filter((deviceMeasurementRow) => deviceMeasurementRow.id === deviceMeasurement.id));
    deviceMeasurementRowsModalLoading.value = false;
}

async function exportData() {
    await deviceMeasurementStore.fetchDeviceMeasurements();

    const deviceMeasurements = deviceMeasurementStore.getDeviceMeasurementsByRoomIdAndMeasurementType(props.roomId, "indoor-ambiance");

    if (!deviceMeasurements.length) {
        return;
    }

    const deviceMeasurementRows = await deviceMeasurementRowStore.fetchDeviceMeasurementRows(props.roomId, "indoor-ambiance", exportFromDate.value, exportToDate.value);
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

    fileDownload(csv1, "device-measurement-indoor-ambiance-current-export.csv");
    fileDownload(csv2, "device-measurement-indoor-ambiance-history-export.csv");
}
</script>

<template>
    <div id="indoor-ambiance-device-measurement-rows-modal" class="modal fade" tabindex="-1">
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
                                    <th class="text-end">{{ $t("main.temperature") }}</th>
                                    <th class="text-end">{{ $t("main.humidity") }}</th>
                                    <th class="text-end">{{ $t("main.voltage") }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(deviceMeasurementRow, index) in deviceMeasurementRowsModalData" :key="index">
                                    <td class="text-center">{{ new Date(deviceMeasurementRow.datetime).toLocaleString() }}</td>
                                    <td class="text-end">{{ deviceMeasurementRow.temperature }} °C</td>
                                    <td class="text-end">{{ deviceMeasurementRow.humidity }} %</td>
                                    <td class="text-end">{{ deviceMeasurementRow.vdd ?? "?" }} mV</td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t("main.close") }}</button>
                </div>
            </div>
        </div>
    </div>

    <div class="table-responsive bg-white p-4 rounded border border-danger mb-3">
        <template v-if="deviceMeasurements.length">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>{{ $t("main.name") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="deviceMeasurement in deviceMeasurements">
                        <td>
                            <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#indoor-ambiance-device-measurement-rows-modal" @click="loadDeviceMeasurementRowsModal(deviceMeasurement)">{{ deviceMeasurement.name }}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type="button" class="btn btn-primary mb-3" @click="deviceMeasurementStore.fetchDeviceMeasurements()">{{ $t("main.refresh") }}</button>
            <form class="row row-cols-lg-auto g-3 align-items-center" @submit.prevent="exportData">
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
        </template>
        <div v-else class="alert alert-info mb-0">{{ $t("dialogs.noData") }}</div>
    </div>
</template>
