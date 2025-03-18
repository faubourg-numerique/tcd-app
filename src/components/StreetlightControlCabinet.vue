<script setup lang="ts">
import { computed, defineProps, onMounted } from "vue";
import { useStreetlightControlCabinetStore } from "@/stores/streetlight-control-cabinet-store";
import { useStreetlightStore } from "@/stores/streetlight-store";
import CabinetDetails from "@/components/StreetlightControlCabinetDetails.vue";

const props = defineProps<{ selectedZoneId: string | null }>();

const cabinetStore = useStreetlightControlCabinetStore();
const streetlightStore = useStreetlightStore();

onMounted(() => {
  cabinetStore.fetchCabinets();
  streetlightStore.fetchStreetlights();
});

const filteredCabinets = computed(() => {
  if (!props.selectedZoneId) return [];
  return cabinetStore.cabinets.filter(
    (cabinet) => cabinet.hasZone === props.selectedZoneId
  );
});

const getStreetlightsForCabinet = (cabinetId: string) => {
  return streetlightStore.streetlights.filter(
    (streetlight) => streetlight.refStreetlightControlCabinet === cabinetId
  );
};
</script>

<template>
  <div class="container bg-white p-4 rounded border border-danger">
    <h2 class="text-center">{{ $t("main.ArmoiresEclairage") }}</h2>

    <div v-if="filteredCabinets.length > 0">
      <div v-for="cabinet in filteredCabinets" :key="cabinet.id">
        <div>
          <strong>{{ cabinet.name }}</strong> 
        </div>
        <CabinetDetails :cabinet="cabinet" :streetlights="getStreetlightsForCabinet(cabinet.id)" />
      </div>
    </div>

    <p v-else class="text-muted text-center">
      ({{ $t("main.Aucunearmoirepourcettezone") }})
    </p>
  </div>
</template>
