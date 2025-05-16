<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, type Reactive, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZoneBuildingRoomPicker from "@/components/CityZoneBuildingRoomPicker.vue";
import OperationParametersPicker from "@/components/OperationParametersPicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";
import ThermostatTab from "@/components/ThermostatTab.vue";
import IndoorAmbianceTab from "@/components/IndoorAmbianceTab.vue";

import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useDeviceMeasurementRowStore } from "@/stores/device-measurement-row-store";
import { useZoneStore } from "@/stores/zone-store";

const route = useRoute();

const zoneStore = useZoneStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);
const selectedBuildingId: Ref<string | null> = ref((route.query.building as string) ?? null);
const selectedRoomId: Ref<string | null> = ref((route.query.roomId as string) ?? null);

const zone = computed(() => {
    if (!selectedZoneId.value) {
        return null;
    }

    return zoneStore.getZone(selectedZoneId.value);
});

const thermostatResponsibility = computed(() => {
    if (!zone.value) {
        return false;
    }

    return zone.value.responsibilities.includes("BUILDINGS_THERMOSTAT");
});

const indoorAmbianceResponsibility = computed(() => {
    if (!zone.value) {
        return false;
    }

    return zone.value.responsibilities.includes("BUILDINGS_INDOOR_AMBIANCE");
});

</script>

<template>
    <div class="container">
        <h1 class="mb-3">Bâtiments</h1>
        <CityZoneBuildingRoomPicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" v-model:selected-building-id="selectedBuildingId" v-model:selected-room-id="selectedRoomId" :responsibilities="['BUILDINGS_THERMOSTAT','BUILDINGS_INDOOR_AMBIANCE']" class="mb-3" />

        <template v-if="selectedCityId && selectedZoneId && selectedBuildingId && selectedRoomId">
            <!-- <OperationParametersPicker v-model="selectedOperationParametersId" v-model:selected-operation-id="selectedOperationId" v-model:selected-operation-parameters-id="selectedOperationParametersId" :zone-id="selectedZoneId" class="mb-3" /> -->

            <ul id="pills-tab" class="nav nav-pills mb-3">
                <li v-if="thermostatResponsibility" class="nav-item">
                    <button class="nav-link" :class="{ 'active': thermostatResponsibility }" data-bs-toggle="pill" data-bs-target="#pills-thermostat">{{ $t("main.heating") }}</button>
                </li>
                <li v-if="indoorAmbianceResponsibility" class="nav-item">
                    <button class="nav-link" :class="{ 'active': !thermostatResponsibility }" data-bs-toggle="pill" data-bs-target="#pills-indoor-ambiance">{{ $t("main.ambiance") }}</button>
                </li>
            </ul>
            <div class="tab-content">
                <div v-if="thermostatResponsibility" id="pills-thermostat" class="tab-pane" :class="{ 'active': thermostatResponsibility, 'show': thermostatResponsibility }" tabindex="0">
                    <ThermostatTab :room-id="selectedRoomId"></ThermostatTab>
                    <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
                </div>
                <div v-if="indoorAmbianceResponsibility" id="pills-indoor-ambiance" class="tab-pane" :class="{ 'active': !thermostatResponsibility, 'show': !thermostatResponsibility }" tabindex="0">
                    <IndoorAmbianceTab :room-id="selectedRoomId"></IndoorAmbianceTab>
                </div>
            </div>
        </template>
    </div>
</template>
