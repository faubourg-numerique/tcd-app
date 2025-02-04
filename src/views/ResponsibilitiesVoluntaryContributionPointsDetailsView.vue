<script setup lang="ts">
import { useRoute } from "vue-router";

import DeviceMeasurementAlerts from "@/components/DeviceMeasurementAlerts.vue";
import DeviceMeasurementInformations from "@/components/DeviceMeasurementInformations.vue";
import DeviceMeasurementVisualizations from "@/components/DeviceMeasurementVisualizations.vue";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useCityStore } from "@/stores/city-store";
import { useZoneStore } from "@/stores/zone-store";
import { useWasteContainerStore } from "@/stores/waste-container-store";

const route = useRoute();

const deviceMeasurementStore = useDeviceMeasurementStore();
const cityStore = useCityStore();
const zoneStore = useZoneStore();
const wasteContainerStore = useWasteContainerStore();

const deviceMeasurement = deviceMeasurementStore.getDeviceMeasurement(route.params.deviceMeasurementId as string);
const entity = wasteContainerStore.getWasteContainerByDeviceMeasurementId(deviceMeasurement.id);

const zone = zoneStore.getZone(entity.hasZone);
const city = cityStore.getCity(zone.hasCity);
</script>

<template>
    <div class="container">
        <h1>{{ $t("main.monitoringOfVoluntaryContributionPoints") }}</h1>
        <div class="mb-4">
            <RouterLink :to="{ name: 'responsibilities.voluntaryContributionPoints', query: { cityId: city.id, zoneId: zone.id } }" class="text-decoration-none">
                <FontAwesomeIcon :icon="['fas', 'arrow-left']" class="me-2" />
                Retourner sur la liste des PAV
            </RouterLink>
        </div>
        <div class="bg-light p-3 rounded shadow mb-5">
            <dl class="row">
                <dt class="col-sm-3">{{ $t("main.name") }}</dt>
                <dd class="col-sm-9">{{ deviceMeasurement.name }}</dd>
                <dt class="col-sm-3">{{ $t("main.fillingLevel") }}</dt>
                <dd class="col-sm-9">{{ deviceMeasurement.fillingLevel ? Math.floor(deviceMeasurement.fillingLevel) : "N/A" }} %</dd>
            </dl>
            <DeviceMeasurementVisualizations :device-measurement-id="deviceMeasurement.id" />
            <DeviceMeasurementAlerts :device-measurement-id="deviceMeasurement.id" />
        </div>
    </div>
</template>
