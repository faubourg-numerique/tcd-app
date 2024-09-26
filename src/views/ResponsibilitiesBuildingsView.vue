<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZonePicker from "@/components/CityZonePicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";
import { useThermostatStore } from "@/stores/thermostat-store";
import OperationParametersPicker from "@/components/OperationParametersPicker.vue";
const route = useRoute();
const thermostatStore = useThermostatStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);

const selectedOperationId: Ref<string | null> = ref(null);
const selectedOperationParametersId: Ref<string | null> = ref(null);
</script>

<template>
    <div class="container">
        <CityZonePicker class="mb-3" v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" />
        <template v-if="selectedCityId && selectedZoneId">
            <OperationParametersPicker v-model="selectedOperationParametersId" v-model:selected-operation-id="selectedOperationId" v-model:selected-operation-parameters-id="selectedOperationParametersId" />
            <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
        </template>
    </div>
</template>
