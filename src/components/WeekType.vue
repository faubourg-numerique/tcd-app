<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useOperationScheduleStore } from "@/stores/operation-schedule-store";
import { useOperationStore } from "@/stores/operation-store";
import { useOperationParametersStore } from "@/stores/operation-parameters-store";
import { defineProps } from "vue";

// 📌 Stores
const operationScheduleStore = useOperationScheduleStore();
const operationStore = useOperationStore();
const operationParametersStore = useOperationParametersStore();

// 📌 Props pour récupérer la zone sélectionnée
const props = defineProps<{ zone: string }>();

// 📌 Liste des jours de la semaine
const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// 📌 Stockage des horaires par jour
const schedule = ref(
  daysOfWeek.map((day) => ({ day, startTime: "", endTime: "" }))
);

// 📌 Chargement des données existantes
onMounted(async () => {
  await Promise.all([
    operationScheduleStore.fetchOperationSchedules(),
    operationStore.fetchOperations(),
    operationParametersStore.fetchOperationParameters(),
  ]);


  const existingSchedules = operationScheduleStore.getOperationSchedulesByZoneId(props.zone);
  if (existingSchedules.length > 0) {
    existingSchedules.forEach((op) => {
    op.byDay.forEach((dayIndex: number) => {
    const correctedIndex = dayIndex - 1;
      if (schedule.value[correctedIndex]) {
        schedule.value[correctedIndex].startTime = op.startTime || "";
        schedule.value[correctedIndex].endTime = op.endTime || "";
      }
    });
    });
  }
});


const operation = computed(() => {
  const operations = operationStore.getOperationsByZoneId(props.zone);
  return operations.length > 0 ? operations[0].id : null;
});

const operationParameters = computed(() => {
  if (!operation.value) return null;
  const parameters = operationParametersStore.getOperationParametersByOperationId(operation.value);
  return parameters.length > 0 ? parameters[0].id : null;
});

const saveSchedule = async () => {
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  const endDate = new Date(today.getFullYear(), 11, 31).toISOString().split("T")[0];

  const schedulesToSave = schedule.value
    .map((entry, index) => {
      if (entry.startTime && entry.endTime) {
        return {
          byDay: [index +1], // un seul jour à la fois
          duration: calculateDuration(entry.startTime, entry.endTime),
          startDate,
          endDate,
          startTime: entry.startTime,
          endTime: entry.endTime,
          name: `Semaine type - ${entry.day}`,
          hasOperation: operation.value || "",
          hasOperationParameters: operationParameters.value || "",
          hasZone: props.zone,
        };
      }
      return null;
    })
    .filter(Boolean); 
  if (schedulesToSave.length === 0) {
    alert("Veuillez remplir au moins un jour avec une heure de début et de fin.");
    return;
  }

  // Enregistrement des horaires un par un
  for (const sched of schedulesToSave) {
    await operationScheduleStore.createOperationSchedule(sched);
  }

  alert("Horaires enregistrés !");
};

function calculateDuration(startTime: string, endTime: string) {
  if (!startTime || !endTime) return "00:00:00";

  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let start = startHour * 60 + startMin;
  let end = endHour * 60 + endMin;


  if (end <= start) {
    end += 24 * 60;
  }

  const durationMin = end - start;
  const hours = Math.floor(durationMin / 60).toString().padStart(2, "0");
  const minutes = (durationMin % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:00`;
}

</script>

<template>
  <div class="week-type-container">
    <div class="buttons">
      <button class="btn btn-primary">Semaine type</button>
      <button class="btn btn-outline-primary">Événements</button>
    </div>

    <table class="table mt-3">
      <thead class="table-dark">
        <tr>
          <th>Jour</th>
          <th>Allumage</th>
          <th>Extinction</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in schedule" :key="index">
          <td>{{ entry.day }}</td>
          <td><input type="time" class="form-control" v-model="entry.startTime" /></td>
          <td><input type="time" class="form-control" v-model="entry.endTime" /></td>
        </tr>
      </tbody>
    </table>

    <button class="btn btn-success" @click="saveSchedule">Enregistrer</button>
  </div>
</template>

<style scoped>
.week-type-container {
  margin-top: 20px;
}

.buttons {
  display: flex;
  gap: 10px;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}
</style>
