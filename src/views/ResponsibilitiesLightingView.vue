<script setup lang="ts">
import { ref, type Ref } from "vue";

import { useStreetlightStore } from "@/stores/streetlight-store";
import CityZoneSelector from "@/components/CityZoneSelector.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const streetlightStore = useStreetlightStore();

const selectedCityId: Ref<string | null> = ref(route.query.cityId as string ?? null);
const selectedZoneId: Ref<string | null> = ref(route.query.zoneId as string ?? null);

async function updateStreetlightPowerState(cityId: string, zoneId: string, streetlightId: string, powerState: string) {
    const streetlight = streetlightStore.getStreetlight(streetlightId);
    const data = {
        powerState: powerState,
    };
    await streetlightStore.updateStreetlight(cityId, zoneId, streetlightId, data);
    streetlight.powerState = powerState;
}
</script>

<template>
    <div class="container">
        <div class="m-4">
            <CityZoneSelector v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId"></CityZoneSelector>
        </div>
        <div v-if="selectedCityId && selectedZoneId" class="container-fluid">
            <div class="row">
                <div v-for="(streetlight, index) in streetlightStore.getStreetlightsByZoneId(selectedZoneId)" :key="streetlight.id" class="col-md mb-4">
                    <div class="bg-white p-1 rounded text-center border streetlightForm">
                        <div class="input-group d-block max-auto">
                            <label :for="'streetlight-' + streetlight.id" class="fs-1" role="button">
                                <FontAwesomeIcon v-if="streetlight.powerState === 'on'" :icon="['fas', 'lightbulb']" />
                                <FontAwesomeIcon v-else :icon="['far', 'lightbulb']" />
                            </label>
                            <p class="fs-6">{{ $t("manager.streetlight." + streetlight.powerState) }}</p>
                            <p class="fs-6 text-danger">{{ streetlight.name }}</p>
                            <input :id="'streetlight-' + streetlight.id" type="checkbox" class="d-none" :checked="streetlight.powerState === 'on'" @click="updateStreetlightPowerState(selectedCityId, selectedZoneId, streetlight.id, streetlight.powerState === 'off' ? 'on' : 'off')" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-5">
                <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
            </div>
        </div>
        <div v-else class="container-fluid">
            <div class="center">
                <p class="text-center">{{ $t("manager.streetlight.error") }}</p>
            </div>
        </div>
    </div>
</template>
