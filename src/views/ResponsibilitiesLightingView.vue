<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { useRoute } from "vue-router";
import { useStreetlightControlCabinetStore } from "@/stores/streetlight-control-cabinet-store";
import CityZonePicker from "@/components/CityZonePicker.vue";
import OperationParametersPicker from "@/components/OperationParametersPicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";
import StreetlightControlCabinet from "@/components/StreetlightControlCabinet.vue";
import StreetlightMap from "@/components/StreetlightMap.vue";
import WeekType from "@/components/WeekType.vue";


const route = useRoute();
const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);
const selectedOperationId: Ref<string | null> = ref(null);
const selectedOperationParametersId: Ref<string | null> = ref(null);

const cabinetStore = useStreetlightControlCabinetStore();

const showWeekType = ref(false);
const showEvents = ref(false);

onMounted(() => {
  cabinetStore.fetchCabinets();
});
</script>

<template>
  <div class="container mt-4">
    <CityZonePicker 
      v-model:selected-city-id="selectedCityId" 
      v-model:selected-zone-id="selectedZoneId" 
      :responsibilities="[]" 
      class="mb-4"
    />
    <template v-if="selectedCityId && selectedZoneId">
            <StreetlightControlCabinet :selected-zone-id="selectedZoneId" />
            <OperationParametersPicker v-model="selectedOperationId" v-model:selected-operation-id="selectedOperationId" v-model:selected-operation-parameters-id="selectedOperationParametersId" :zone-id="selectedZoneId" />
           <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" /> 
        </template> 

    <template v-if="selectedCityId && selectedZoneId">
      <StreetlightMap :selected-zone-id="selectedZoneId" />

      
      <div class="d-flex gap-3 mt-3">
        <button class="btn btn-primary" @click="showWeekType = !showWeekType" >Semaine type</button>
        <button class="btn btn-outline-primary"  @click="showEvents = !showEvents" >Événements</button>
      </div>

      <div v-if="showWeekType" class="card mt-3">
        <div class="card-body">
          <h5 class="card-title">Semaine type</h5>
          <p class="card-text"><WeekType :zone="selectedZoneId" /></p>
        </div>
      </div>

      <div v-if="showEvents" class="card mt-3">
        <div class="card-body">
          <h5 class="card-title">Événements</h5>
          <p class="card-text">Liste des événements...</p>
        </div>
      </div>
    </template>
  </div>
</template>
