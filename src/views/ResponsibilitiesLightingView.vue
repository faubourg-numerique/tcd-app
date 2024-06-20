<script setup lang="ts">
import { ref, type Ref } from "vue";

import { useCityStore } from "@/stores/city-store";
import { useStreetlightStore } from "@/stores/streetlight-store";
import { useZoneStore } from "@/stores/zone-store";

const cityStore = useCityStore();
const streetlightStore = useStreetlightStore();
const zoneStore = useZoneStore();

const selectedCityId: Ref<string | null> = ref(null);
const selectedZoneId: Ref<string | null> = ref(null);

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
    <div class="m-4">
        <div class="bg-white p-4 rounded text-center border border-danger">
            <div class="form-group">
                <label for="city-id" class="form-label">{{ $t("manager.selectACity") }}</label>
                <select id="city-id" v-model="selectedCityId" class="form-select">
                    <option :value="null" disabled>{{ $t("manager.selectACity") }}</option>
                    <option v-for="city in cityStore.cities" :key="city.id" :value="city.id">{{ city.name }}</option>
                </select>
            </div>
            <div v-if="selectedCityId" class="form-group">
                <label for="zone-id" class="form-label">{{ $t("manager.selectAZone") }}</label>
                <select id="zone-id" v-model="selectedZoneId" class="form-select">
                    <option :value="null" disabled>{{ $t("manager.selectAZone") }}</option>
                    <option v-for="zone in zoneStore.getZonesByCityId(selectedCityId)" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
                </select>
            </div>
        </div>
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
    </div>
    <div v-else class="container-fluid">
        <div class="center">
            <p class="text-center">{{ $t("manager.streetlight.error") }}</p>
        </div>
    </div>
</template>
