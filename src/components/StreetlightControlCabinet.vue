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
    <h2 class="text-center">Armoires d'Éclairage</h2>

    <div v-if="filteredCabinets.length > 0" id="cabinetAccordion" class="accordion">
      <div v-for="(cabinet, index) in filteredCabinets" :key="cabinet.id" class="accordion-item">
        <h2 :id="'heading' + index" class="accordion-header">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" aria-expanded="false" :aria-controls="'collapse' + index">
            {{ cabinet.name }} (Zone: {{ cabinet.hasZone }})
          </button>
        </h2>

        <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index" data-bs-parent="#cabinetAccordion">
          <CabinetDetails :cabinet="cabinet" :streetlights="getStreetlightsForCabinet(cabinet.id)" />
        </div>
      </div>
    </div>

    <p v-else class="text-muted text-center">
      Aucune armoire trouvée pour cette zone.
    </p>
  </div>
</template>
