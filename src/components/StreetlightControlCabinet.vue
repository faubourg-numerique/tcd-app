<script setup lang="ts">
import { computed, defineProps, onMounted } from "vue";
import { useStreetlightControlCabinetStore } from "@/stores/streetlight-control-cabinet-store";
import { useStreetlightStore } from "@/stores/streetlight-store";

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
      <div v-for="(cabinet, index) in filteredCabinets" :key="cabinet.id" class="accordion-item" >
        <h2 :id="'heading' + index" class="accordion-header">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index"  aria-expanded="false" :aria-controls="'collapse' + index">
            {{ cabinet.name }} (Zone: {{ cabinet.hasZone }})
          </button>
        </h2>

        <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index" data-bs-parent="#cabinetAccordion" >
          <div class="accordion-body">
            <table class="table table-bordered table-striped mt-2">
              <thead class="table-danger">
                <tr>
                  <th scope="col">Nom du Lampadaire</th>
                  <th scope="col">État</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="streetlight in getStreetlightsForCabinet(cabinet.id)" :key="streetlight.id" >
                  <td>{{ streetlight.name }}</td>
                  <td>{{ streetlight.powerState }}</td>
                </tr>
              </tbody>
            </table>

            <p v-if="getStreetlightsForCabinet(cabinet.id).length === 0" class="text-muted text-center"   >
              Aucun lampadaire associé.
            </p>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-muted text-center">
      Aucune armoire trouvée pour cette zone.
    </p>
  </div>
</template>
