<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZonePicker from "@/components/CityZonePicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";
import { useStreetlightStore } from "@/stores/streetlight-store";
import OperationParametersPicker from "@/components/OperationParametersPicker.vue";

const route = useRoute();

const streetlightStore = useStreetlightStore();
const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);

const selectedOperationId: Ref<string | null> = ref(null);
const selectedOperationParametersId: Ref<string | null> = ref(null);
</script>

<template>
    <div class="container">
        <CityZonePicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" class="mb-4" />
        <template v-if="selectedCityId && selectedZoneId">
            <OperationParametersPicker v-model="selectedOperationId" v-model:selected-operation-id="selectedOperationId" v-model:selected-operation-parameters-id="selectedOperationParametersId" />
            <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
        </template>
    </div>
</template>
