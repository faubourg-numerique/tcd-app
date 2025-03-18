<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { useRoute } from "vue-router";
import { useStreetlightControlCabinetStore } from "@/stores/streetlight-control-cabinet-store";
import CityZonePicker from "@/components/CityZonePicker.vue";
import OperationParametersPicker from "@/components/OperationParametersPicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";
import StreetlightControlCabinet from "@/components/StreetlightControlCabinet.vue";

const route = useRoute();
const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);
const selectedOperationId: Ref<string | null> = ref(null);
const selectedOperationParametersId: Ref<string | null> = ref(null);

const cabinetStore = useStreetlightControlCabinetStore();


onMounted(() => {
  cabinetStore.fetchCabinets();
});
</script>

<template>
    <div class="container">
        <CityZonePicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" :responsibilities="[]" class="mb-4" />
        <template v-if="selectedCityId && selectedZoneId">
            <StreetlightControlCabinet :selected-zone-id="selectedZoneId" />
            <OperationParametersPicker v-model="selectedOperationId" v-model:selected-operation-id="selectedOperationId" v-model:selected-operation-parameters-id="selectedOperationParametersId" :zone-id="selectedZoneId" />
           <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" /> 
        </template>
    </div>
</template>
