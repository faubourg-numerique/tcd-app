@ -1,241 +0,0 @@
<script setup lang="ts">
import Modal from "bootstrap/js/dist/modal";
import { computed, onMounted, reactive, ref, type Ref, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import type { CalendarOptions, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import swal from "sweetalert2";

import { useOperationScheduleStore } from "@/stores/operation-schedule-store";
import type { OperationSchedule } from "@/models/OperationSchedule";

const weekDays = [
    "SU",
    "MO",
    "TU",
    "WE",
    "TH",
    "FR",
    "SA",
    "SU",
];

const props = defineProps({
    cityId: {
        type: String,
        required: true,
    },
    zoneId: {
        type: String,
        required: true,
    },
});

const startDate: Ref<string> = ref("");
const startTime: Ref<string> = ref("");
const endDate: Ref<string> = ref("");
const endTime: Ref<string> = ref("");

function computeStartDateTime() {
    if (!startDate.value || !startTime.value) {
        return;
    }

    const date = new Date(`${startDate.value}T${startTime.value}`);
    operationSchedule.startDate = date.toISOString().slice(0, 10);
    operationSchedule.startTime = date.toISOString().slice(11, 19) + "Z";
}

function computeEndDateTime() {
    if (!endDate.value || !endTime.value) {
        return;
    }

    const date = new Date(`${endDate.value}T${endTime.value}`);
    operationSchedule.endDate = date.toISOString().slice(0, 10);
    operationSchedule.endTime = date.toISOString().slice(11, 19) + "Z";
}

watch(startDate, computeStartDateTime);
watch(startTime, computeStartDateTime);

watch(endDate, computeEndDateTime);
watch(endTime, computeEndDateTime);

const operationScheduleStore = useOperationScheduleStore();

const operationSchedule: OperationSchedule = reactive({
    id: "",
    name: "",
    byDay: [],
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    hasZone: props.zoneId,
});

const operationScheduleFormModalElement = ref(null);
let operationScheduleFormModal: Modal|null = null;

const events = computed(() => {
    const operationSchedules = operationScheduleStore.getOperationSchedulesByZoneId(props.zoneId);
    return operationSchedules.map((operationSchedule) => {
        if (operationSchedule.byDay.length) {
            return {
                id: operationSchedule.id,
                title: operationSchedule.name,
                rrule: {
                    freq: "weekly",
                    interval: 1,
                    byweekday: operationSchedule.byDay.map((day) => weekDays[day]),
                    dtstart: `${operationSchedule.startDate}T${operationSchedule.startTime}`,
                    until: `${operationSchedule.endDate}T${operationSchedule.endTime}`
                },
                startTime: operationSchedule.startTime,
                endime: operationSchedule.endTime,
            }
        } else {
            return {
                id: operationSchedule.id,
                title: operationSchedule.name,
                start: `${operationSchedule.startDate}T${operationSchedule.startTime}`,
                end: `${operationSchedule.endDate}T${operationSchedule.endTime}`,
            }
        }
    });
});

const options = reactive<CalendarOptions>({
    plugins: [dayGridPlugin, interactionPlugin, rrulePlugin],
    initialView: "dayGridMonth",
    locale: "fr",
    events: events,
    firstDay: 1,
    dateClick: ({ dateStr }: { dateStr: string }) => {
        if (!operationScheduleFormModal) {
            return;
        }

        operationSchedule.id = "";
        operationSchedule.name = "";
        operationSchedule.byDay = [];
        operationSchedule.startDate = dateStr;
        operationSchedule.startTime = "";
        operationSchedule.endDate = dateStr;
        operationSchedule.endTime = "";
        operationSchedule.hasZone = props.zoneId;

        startDate.value = "";
        startTime.value = "";
        endDate.value = "";
        endTime.value = "";

        operationScheduleFormModal.show();
    },
    eventClick: ({ event }: EventClickArg) => {
        if (!operationScheduleFormModal) {
            return;
        }

        Object.assign(operationSchedule, operationScheduleStore.getOperationSchedule(event.id));

        const startDateTime = new Date(`${operationSchedule.startDate}T${operationSchedule.startTime}`);
        startDate.value = `${startDateTime.getFullYear()}-${String(startDateTime.getMonth() + 1).padStart(2, "0")}-${String(startDateTime.getDate()).padStart(2, "0")}`;
        startTime.value = `${String(startDateTime.getHours()).padStart(2, "0")}:${String(startDateTime.getMinutes()).padStart(2, "0")}:${String(startDateTime.getSeconds()).padStart(2, "0")}`;

        const endDateTime = new Date(`${operationSchedule.endDate}T${operationSchedule.endTime}`);
        endDate.value = `${endDateTime.getFullYear()}-${String(endDateTime.getMonth() + 1).padStart(2, "0")}-${String(endDateTime.getDate()).padStart(2, "0")}`;
        endTime.value = `${String(endDateTime.getHours()).padStart(2, "0")}:${String(endDateTime.getMinutes()).padStart(2, "0")}:${String(endDateTime.getSeconds()).padStart(2, "0")}`;

        operationScheduleFormModal.show();
    },
});

async function createOperationSchedule(operationSchedule: OperationSchedule) {
    await operationScheduleStore.createOperationSchedule(operationSchedule);

    if (operationScheduleFormModal) {
        operationScheduleFormModal.hide();
    }
}

async function updateOperationSchedule(operationSchedule: OperationSchedule) {
    await operationScheduleStore.updateOperationSchedule(operationSchedule);

    if (operationScheduleFormModal) {
        operationScheduleFormModal.hide();
    }
}

async function deleteOperationSchedule(operationSchedule: OperationSchedule) {
    const result = await swal.fire({
        icon: "question",
        title: "Supprimer cet évènement ?",
        text: "Êtes-vous sûr de vouloir supprimer cet évènement ?",
        showCancelButton: true,
    });

    if (!result) {
        return;
    }

    await operationScheduleStore.deleteOperationSchedule(operationSchedule);

    if (operationScheduleFormModal) {
        operationScheduleFormModal.hide();
    }
}

onMounted(() => {
    if (operationScheduleFormModalElement.value) {
        operationScheduleFormModal = new Modal(operationScheduleFormModalElement.value);
    }
});
</script>

<template>
    <div ref="operationScheduleFormModalElement" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable">
            <form class="modal-content" @submit.prevent="operationSchedule.id ? updateOperationSchedule(operationSchedule) : createOperationSchedule(operationSchedule)">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">{{ operationSchedule.id ? "Modifier" : "Ajouter" }} un évènement</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="name" class="form-label">Nom</label>
                        <input v-model="operationSchedule.name" id="name" type="text" class="form-control" required autofocus>
                    </div>
                    <div class="mb-3">
                        <label for="start-date" class="form-label">Date de début</label>
                        <input v-model="startDate" id="start-date" type="date" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="start-time" class="form-label">Heure de début</label>
                        <input v-model="startTime" id="start-time" type="time" step="1" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="end-date" class="form-label">Date de fin</label>
                        <input v-model="endDate" id="end-date" type="date" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="end-time" class="form-label">Heure de fin</label>
                        <input v-model="endTime" id="end-time" type="time" step="1" class="form-control" required>
                    </div>
                    <div>
                        <label for="by-day" class="form-label">Récurrence</label>
                        <select v-model="operationSchedule.byDay" id="by-day" class="form-select" multiple>
                            <option :value="1">Lundi</option>
                            <option :value="2">Mardi</option>
                            <option :value="3">Mercredi</option>
                            <option :value="4">Jeudi</option>
                            <option :value="5">Vendredi</option>
                            <option :value="6">Samedi</option>
                            <option :value="7">Dimanche</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button v-if="operationSchedule.id" type="button" class="btn btn-danger" @click="deleteOperationSchedule(operationSchedule)">Supprimer</button>
                    <button type="submit" class="btn" :class="{'btn-success': !operationSchedule.id, 'btn-warning': operationSchedule.id}">{{ operationSchedule.id ? "Modifier" : "Ajouter" }}</button>
                </div>
            </form>
        </div>
    </div>
    <FullCalendar :options="options" />
</template>
