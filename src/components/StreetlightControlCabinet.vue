<script setup lang="ts">
import { computed, defineProps, onMounted } from "vue";
import { useStreetlightControlCabinetStore } from "@/stores/streetlight-control-cabinet-store";
import { C } from "node_modules/@fullcalendar/core/internal-common";


const props = defineProps<{ selectedZoneId: string | null }>(); 

const cabinetStore = useStreetlightControlCabinetStore(); 


onMounted(() => {
  cabinetStore.fetchCabinets();
});

const filteredCabinets = computed(() => {
  if (!props.selectedZoneId) return []; 
  return cabinetStore.cabinets.filter(cabinet => cabinet.hasZone === props.selectedZoneId);
});
</script>

<template>
  <div class="container bg-white p-4 rounded border border-danger">
    <h2 class="text-center">Armoires d'Éclairage</h2>

    <table class="table table-bordered table-striped mt-3">
      <thead class="table-danger">
        <tr><th scope="col">Nom</th><th scope="col">Zone</th></tr>
      </thead>
      <tbody>
        <tr v-for="cabinet in filteredCabinets" :key="cabinet.id"><td>{{ cabinet.name }}</td> <td>{{ cabinet.hasZone }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="filteredCabinets.length === 0" class="text-muted text-center">Aucune armoire trouvée pour cette zone.</p>
  </div>
</template>

<style scoped>
.table {
  text-align: center;
  width: 100%;
}
</style>
