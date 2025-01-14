<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZonePicker from "@/components/CityZonePicker.vue";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useWasteContainerStore } from "@/stores/waste-container-store";

const route = useRoute();

const wasteContainerStore = useWasteContainerStore();
const deviceMeasurementStore = useDeviceMeasurementStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);
</script>

<template>
    <div class="container">
        <CityZonePicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" class="mb-4" />
        <template v-if="selectedCityId && selectedZoneId">
            <h1>{{ $t("main.voluntaryContributionPoints") }}</h1>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>{{ $t("main.name") }}</th>
                            <th class="text-end">{{ $t("main.fillingLevel") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="wasteContainer in wasteContainerStore.getWasteContainersByZoneId(selectedZoneId)" :key="wasteContainer.id">
                            <td>
                                <RouterLink :to="{ name: 'responsibilities.voluntaryContributionPoints.details', params: { deviceMeasurementId: wasteContainer.hasDeviceMeasurement } }" class="no-link">{{ wasteContainer.name }}</RouterLink>
                            </td>
                            <td class="text-end">{{ deviceMeasurementStore.getDeviceMeasurement(wasteContainer.hasDeviceMeasurement)?.fillingLevel ? Math.floor(deviceMeasurementStore.getDeviceMeasurement(wasteContainer.hasDeviceMeasurement).fillingLevel ?? 0) : "N/A" }} %</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
