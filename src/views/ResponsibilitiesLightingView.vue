<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZoneSelector from "@/components/CityZonePicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";
import { useStreetlightStore } from "@/stores/streetlight-store";

const route = useRoute();

const streetlightStore = useStreetlightStore();

const selectedCityId: Ref<string | null> = ref(route.query.cityId as string ?? null);
const selectedZoneId: Ref<string | null> = ref(route.query.zoneId as string ?? null);
</script>

<template>
    <div class="container">
        <CityZoneSelector class="mb-4" v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" />
        <template v-if="selectedCityId && selectedZoneId">
            <div class="row mb-5">
                <div v-for="streetlight in streetlightStore.getStreetlightsByZoneId(selectedZoneId)" :key="streetlight.id" class="col-md mb-4">
                    <div class="p-1 rounded text-center border">{{ streetlight.name }}</div>
                </div>
            </div>
            <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
        </template>
    </div>
</template>
