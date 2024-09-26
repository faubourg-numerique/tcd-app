@ -1,241 +0,0 @@
<script setup lang="ts">
import Modal from "bootstrap/js/dist/modal";
import swal from "sweetalert2";
import { computed, onMounted, reactive, ref, type Ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useOperationParametersStore } from "@/stores/operation-parameters-store";
import { useOperationScheduleStore } from "@/stores/operation-schedule-store";
import { useOperationStore } from "@/stores/operation-store";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import FullCalendar from "@fullcalendar/vue3";

import type { CalendarOptions, EventClickArg } from "@fullcalendar/core";
import type { OperationSchedule } from "@/types/OperationSchedule";

const weekDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA", "SU"];

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

const { t } = useI18n();

const operationStore = useOperationStore();
const operationParametersStore = useOperationParametersStore();
const operationScheduleStore = useOperationScheduleStore();

const operationSchedule: OperationSchedule = reactive({
    id: "",
    byDay: [],
    duration: "",
    endDate: "",
    endTime: "",
    name: "",
    startDate: "",
    startTime: "",
    hasOperation: "",
    hasOperationParameters: "",
    hasZone: props.zoneId,
});

const operationScheduleFormModalElement = ref(null);
let operationScheduleFormModal: Modal | null = null;

const operations = operationStore.getOperationsByZoneId(props.zoneId);

const events = computed(() => {
    const operationSchedules = operationScheduleStore.getOperationSchedulesByZoneId(props.zoneId);
    return operationSchedules.map((operationSchedule) => {
        if (operationSchedule.byDay.length) {
            return {
                id: operationSchedule.id,
                title: operationSchedule.name,
                duration: operationSchedule.duration,
                rrule: {
                    freq: "weekly",
                    interval: 1,
                    byweekday: operationSchedule.byDay.map((day) => weekDays[day]),
                    dtstart: `${operationSchedule.startDate}T${operationSchedule.startTime}`,
                    until: `${operationSchedule.endDate}T${operationSchedule.endTime}`,
                },
            };
        } else {
            const date = new Date(`${operationSchedule.startDate}T${operationSchedule.startTime}`);
            const [hours, minutes, seconds] = operationSchedule.duration.split(":").map(Number);
            date.setHours(date.getHours() + hours);
            date.setMinutes(date.getMinutes() + minutes);
            date.setSeconds(date.getSeconds() + seconds);

            return {
                id: operationSchedule.id,
                title: operationSchedule.name,
                start: `${operationSchedule.startDate}T${operationSchedule.startTime}`,
                end: date.toISOString(),
            };
        }
    });
});

const options = reactive<CalendarOptions>({
    plugins: [dayGridPlugin, interactionPlugin, rrulePlugin],
    initialView: "dayGridMonth",
    locale: "fr",
    // @ts-ignore
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
        operationSchedule.endDate = "";
        operationSchedule.endTime = "";
        operationSchedule.duration = "";
        operationSchedule.hasZone = props.zoneId;
        operationSchedule.hasOperation = "";

        startDate.value = dateStr;
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

    try {
        const date = new Date(`${endDate.value}T${endTime.value}`);
        operationSchedule.endDate = date.toISOString().slice(0, 10);
        operationSchedule.endTime = date.toISOString().slice(11, 19) + "Z";
    } catch (error) {}
}

watch(startDate, computeStartDateTime);
watch(startTime, computeStartDateTime);

watch(endDate, computeEndDateTime);
watch(endTime, computeEndDateTime);

watch(
    () => operationSchedule.byDay,
    () => {
        if (!operationSchedule.byDay.length) {
            endDate.value = "";
            endTime.value = "";
            operationSchedule.endDate = "";
            operationSchedule.endTime = "";
        }
    },
);

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
        title: t("dialogs.deleteOperationScheduleQuestionTitle"),
        text: t("dialogs.deleteOperationScheduleQuestionText"),
        showCancelButton: true,
    });

    if (!result.isConfirmed) {
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
                    <h1 class="modal-title fs-5">{{ operationSchedule.id ? $t("main.editAnEvent") : $t("main.addAnEvent") }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="name" class="form-label">{{ $t("main.name") }}</label>
                        <input id="name" v-model="operationSchedule.name" type="text" class="form-control" required autofocus />
                    </div>
                    <div class="mb-3">
                        <label for="start-date" class="form-label">{{ $t("main.beginDate") }}</label>
                        <input id="start-date" v-model="startDate" type="date" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label for="start-time" class="form-label">{{ $t("main.beginTime") }}</label>
                        <input id="start-time" v-model="startTime" type="time" step="1" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label for="duration" class="form-label">{{ $t("main.duration") }}</label>
                        <input id="duration" v-model="operationSchedule.duration" type="time" step="1" class="form-control" required />
                    </div>
                    <template v-if="operationSchedule.byDay.length">
                        <div class="mb-3">
                            <label for="end-date" class="form-label">{{ $t("main.endDate") }}</label>
                            <input id="end-date" v-model="endDate" type="date" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="end-time" class="form-label">{{ $t("main.endTime") }}</label>
                            <input id="end-time" v-model="endTime" type="time" step="1" class="form-control" required />
                        </div>
                    </template>
                    <div class="mb-3">
                        <label for="by-day" class="form-label">{{ $t("main.recurrence") }}</label>
                        <select id="by-day" v-model="operationSchedule.byDay" class="form-select" multiple>
                            <option :value="1">Lundi</option>
                            <option :value="2">Mardi</option>
                            <option :value="3">Mercredi</option>
                            <option :value="4">Jeudi</option>
                            <option :value="5">Vendredi</option>
                            <option :value="6">Samedi</option>
                            <option :value="7">Dimanche</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="by-day" class="form-label">{{ $t("main.operation") }}</label>
                        <select id="has-operation" v-model="operationSchedule.hasOperation" class="form-select" required>
                            <option v-for="operation in operations" :value="operation.id">{{ operation.name }}</option>
                        </select>
                    </div>
                    <div v-if="operationSchedule.hasOperation">
                        <label for="has-operation-parameters" class="form-label">{{ $t("main.parameters") }}</label>
                        <select id="has-operation-parameters" v-model="operationSchedule.hasOperationParameters" class="form-select" required>
                            <option v-for="operationParameters in operationParametersStore.getOperationParametersByOperationId(operationSchedule.hasOperation)" :key="operationParameters.id" :value="operationParameters.id">{{ operationParameters.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t("main.close") }}</button>
                    <button v-if="operationSchedule.id" type="button" class="btn btn-danger" @click="deleteOperationSchedule(operationSchedule)">{{ $t("main.delete") }}</button>
                    <button type="submit" class="btn" :class="{ 'btn-success': !operationSchedule.id, 'btn-warning': operationSchedule.id }">{{ operationSchedule.id ? $t("main.edit") : $t("main.add") }}</button>
                </div>
            </form>
        </div>
    </div>
    <FullCalendar :options="options" />
</template>
