<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useOperationScheduleStore } from "@/stores/operation-schedule-store";
import { useOperationStore } from "@/stores/operation-store";
import { useOperationParametersStore } from "@/stores/operation-parameters-store";
import { defineProps } from "vue";
import swal from "sweetalert2";
import { useI18n } from "vue-i18n" ; 

const { t } = useI18n();
const operationScheduleStore = useOperationScheduleStore();
const operationStore = useOperationStore();
const operationParametersStore = useOperationParametersStore();

const props = defineProps<{ zone: string }>();
const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const schedule = ref(
  daysOfWeek.map((day) => ({ 
    day, 
    startTime: "", 
    endTime: "",
    scheduleId: ""
  }))
);

const isLoading = ref(false);
const isSaving = ref(false);
const viewType = ref("week");

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([
    operationScheduleStore.fetchOperationSchedules(),
    operationStore.fetchOperations(),
    operationParametersStore.fetchOperationParameters(),
  ]);
  loadExistingSchedules();
  isLoading.value = false;
});

const loadExistingSchedules = () => {
  const existingSchedules = operationScheduleStore.getOperationSchedulesByZoneId(props.zone);
  schedule.value = daysOfWeek.map((day) => ({ 
    day, 
    startTime: "", 
    endTime: "",
    scheduleId: ""
  }));
  
  if (existingSchedules.length > 0) {
    existingSchedules.forEach((op) => {
      op.byDay.forEach((dayIndex: number) => {
        const correctedIndex = dayIndex - 1;
        if (schedule.value[correctedIndex]) {
          schedule.value[correctedIndex].startTime = op.startTime?.replace('Z', '') || "";
          schedule.value[correctedIndex].endTime = op.endTime?.replace('Z', '') || "";
          schedule.value[correctedIndex].scheduleId = op.id;
        }
      });
    });
  }
};

const operation = computed(() => {
  const operations = operationStore.getOperationsByZoneId(props.zone);
  return operations.length > 0 ? operations[0].id : null;
});

const operationParameters = computed(() => {
  if (!operation.value) return null;
  const parameters = operationParametersStore.getOperationParametersByOperationId(operation.value);
  return parameters.length > 0 ? parameters[0].id : null;
});

const hasChanges = computed(() => {
  return schedule.value.some(entry => entry.startTime && entry.endTime);
});

const saveSchedule = async () => {
  if (isSaving.value) return;
  
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  const endDate = new Date(today.getFullYear(), 11, 31).toISOString().split("T")[0];

  const schedulesToSave = schedule.value
    .map((entry, index) => {
      if (entry.startTime && entry.endTime) {
        return {
          id: entry.scheduleId || "",
          byDay: [index + 1],
          duration: calculateDuration(entry.startTime, entry.endTime),
          startDate,
          endDate,
          startTime: entry.startTime + (entry.startTime.includes(':00') ? 'Z' : ':00Z'),
          endTime: entry.endTime + (entry.endTime.includes(':00') ? 'Z' : ':00Z'),
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
    const result = await swal.fire({
        icon: "success",
        text: t("dialogs.operationRunSuccessTitle")
    });
    if (!result.isConfirmed) {
        return;
    }
    return;
  }

  isSaving.value = true;
  
  for (const sched of schedulesToSave) {
    if (sched.id) {
      await operationScheduleStore.updateOperationSchedule(sched);
    } else {
      const result = await operationScheduleStore.createOperationSchedule(sched);
      const dayIndex = sched.byDay[0] - 1;
      if (schedule.value[dayIndex]) {
        schedule.value[dayIndex].scheduleId = result.id;
      }
    }
  }
  
  alert("Horaires enregistrés avec succès !");
  loadExistingSchedules();
  isSaving.value = false;
};

const clearAllSchedules = async () => {
  const result = await swal.fire({
        icon: "question",
        title: t("dialogs.deleteOperationScheduleQuestionTitle"),
        text: t("dialogs.deleteOperationScheduleQuestionText"),
        showCancelButton: true,
    });

    if (!result.isConfirmed) {
        return;
    }
  isSaving.value = true;
  const existingSchedules = operationScheduleStore.getOperationSchedulesByZoneId(props.zone);
  
  for (const schedule of existingSchedules) {
    await operationScheduleStore.deleteOperationSchedule(schedule);
  }
  
  loadExistingSchedules();
  alert("Tous les horaires ont été supprimés.");
  isSaving.value = false;
};

const changeView = (type: string) => {
  viewType.value = type;
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
  <div class="mt-4">
    <div class="d-flex gap-2 mb-3">
      <button class="btn btn-primary" @click="changeView('week')" :class="{'fw-bold': viewType === 'week'}">Semaine type</button>
      <button class="btn btn-outline-primary" @click="changeView('events')" :class="{'fw-bold': viewType === 'events'}">Événements</button>
    </div>

    <div v-if="viewType === 'week'">
      <div v-if="isLoading" class="text-center my-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2">Chargement des données...</p>
      </div>
      
      <table class="table mt-3" v-else>
        <thead class="table-dark">
          <tr>
            <th>Jour</th>
            <th>Allumage</th>
            <th>Extinction</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in schedule" :key="index" :class="{'table-light': entry.startTime && entry.endTime}">
            <td>{{ entry.day }}</td>
            <td><input type="time" class="form-control" v-model="entry.startTime" /></td>
            <td><input type="time" class="form-control" v-model="entry.endTime" /></td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-danger" @click="clearAllSchedules" :disabled="isLoading || isSaving">
          Supprimer tous les horaires
        </button>
        <button class="btn btn-success" @click="saveSchedule" :disabled="isLoading || isSaving">
          <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </div>
    
    <div v-else class="mt-4">
      <div class="alert alert-info">
        La gestion des événements ponctuels sera développée prochainement.
      </div>
    </div>
  </div>
</template>