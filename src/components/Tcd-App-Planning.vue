<script setup lang="ts">
import { reactive, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import type { CalendarOptions, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modale from "@/components/Modal-App-Planning.vue";
import { useScheduleStore } from "@/stores/schedule-store";
import type Schedule from "@/models/Schedule";

const scheduleStore = useScheduleStore();

// Refs pour gérer l'état de la modale, la date cliquée, et les événements
const isModalOpened = ref(false);

const days = [
    { id: 1, name: "Lundi" },
    { id: 2, name: "Mardi" },
    { id: 3, name: "Mercredi" },
    { id: 4, name: "Jeudi" },
    { id: 5, name: "Vendredi" },
    { id: 6, name: "Samedi" },
    { id: 7, name: "Dimanche" },
];

const scheduleForm = reactive<{
    name: string;
    byDay: number[] | null;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    id: string;
}>({
    name: "",
    byDay: [],
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    id: "",
});
const modalIsUpdate = ref(false);

// Fonction pour ouvrir la modale avec la date cliquée
const openModal = (date: string, idEvent = "") => {
    console.log(idEvent.split('_')[0]);
    const schedule = scheduleStore.schedules.find((scheduleOne) => scheduleOne.id === idEvent.split('_')[0]);
    if (schedule) {
        scheduleForm.name = schedule.name;
        scheduleForm.startDate = schedule.startDate;
        scheduleForm.startTime = schedule.startTime;
        scheduleForm.endDate = schedule.endDate;
        scheduleForm.endTime = schedule.endTime;
        scheduleForm.id = schedule.id;
        scheduleForm.byDay = schedule.byDay;
    } else {
        const dateNow = new Date(date).toISOString();
        scheduleForm.name = "";
        scheduleForm.startDate = dateNow.slice(0, 10);
        scheduleForm.startTime = dateNow.slice(11, 16);
        scheduleForm.endDate = dateNow.slice(0, 10);
        scheduleForm.endTime = dateNow.slice(11, 16);
        scheduleForm.byDay = [];
        scheduleForm.id = "";
    }

    isModalOpened.value = true;
};

// Fonction pour fermer la modale
const closeModal = () => {
    isModalOpened.value = false;
};

const allSchedules = ref<{ title: string; start: string; end: string; id: string }[]>([]);

const calendarOptions = ref<CalendarOptions>({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    locale: "fr",
    dateClick: ({ dateStr }: { dateStr: string }) => {
        modalIsUpdate.value = false;
        openModal(dateStr);
    },
    eventClick: ({ event }: EventClickArg) => {
        modalIsUpdate.value = true;

        openModal(event.startStr, event.id);
    },
});

// Fonction pour ajouter un événement
const addEvent = async () => {
    const actualDate = new Date();

    if (new Date(scheduleForm.startDate + scheduleForm.startTime) < actualDate) {
        alert("La date de début doit être supérieure à la date actuelle");
        return;
    }
    const schedule: Schedule = {
        name: scheduleForm.name,
        startDate: scheduleForm.startDate,
        startTime: scheduleForm.startTime,
        endDate: scheduleForm.endDate,
        endTime: scheduleForm.endTime,
        byDay: scheduleForm.byDay,
        id: scheduleForm.id,
    };
    await scheduleStore.addSchedule(schedule);
    updateCalendarOptions();
    closeModal(); // Fermer la modale après ajout
};

const updateCalendarOptions = () => {
    allSchedules.value = [];

    scheduleStore.schedules.forEach((scheduleOne) => {
        if (scheduleOne.byDay && scheduleOne.byDay.length > 0) {
            // met un event chaque jour selectionné entre les dates de début et de fin
            const startDate = new Date(scheduleOne.startDate);
            const endDate = new Date(scheduleOne.endDate);
            const byDay = scheduleOne.byDay;
            while (startDate <= endDate) {
                if (byDay.includes(startDate.getDay() + 1)) {
                    allSchedules.value.push({
                        title: scheduleOne.name,
                        start: startDate.toISOString().slice(0, 10) + "T" + scheduleOne.startTime,
                        end: startDate.toISOString().slice(0, 10) + "T" + scheduleOne.endTime,
                        id: scheduleOne.id + "_" + startDate.toISOString().slice(0, 10),
                    });
                }
                startDate.setDate(startDate.getDate() + 1);
            }
        } else {
            allSchedules.value.push({
                title: scheduleOne.name,
                start: scheduleOne.startDate + "T" + scheduleOne.startTime,
                end: scheduleOne.endDate + "T" + scheduleOne.endTime,
                id: scheduleOne.id + "_" + scheduleOne.startDate,
            });
        }
    });

    calendarOptions.value = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        locale: "fr",
        events: allSchedules.value, // Lier les événements au calendrier
        dateClick: ({ dateStr }: { dateStr: string }) => {
            modalIsUpdate.value = false;
            openModal(dateStr);
        },
        eventClick: ({ event }: EventClickArg) => {
            modalIsUpdate.value = true;

            openModal(event.startStr, event.id);
        },
    };
    console.log(allSchedules.value);
};

const updateEvent = async () => {
    const actualDate = new Date();

    if (new Date(scheduleForm.startDate + scheduleForm.startTime) < actualDate) {
        alert("La date de début doit être supérieure à la date actuelle");
        return;
    }
    const schedule: Schedule = {
        name: scheduleForm.name,
        startDate: scheduleForm.startDate,
        startTime: scheduleForm.startTime,
        endDate: scheduleForm.endDate,
        endTime: scheduleForm.endTime,
        byDay: scheduleForm.byDay,
        id: scheduleForm.id.split('_')[0],
    };

    allSchedules.value = [];
    await scheduleStore.updateSchedule(schedule.id, schedule);
    updateCalendarOptions();
    closeModal(); // Fermer la modale après ajout
};

const deleteEvent = async () => {
    await scheduleStore.deleteSchedule(scheduleForm.id);
    updateCalendarOptions();
    closeModal(); // Fermer la modale après ajout
};

updateCalendarOptions();
</script>

<template>
    <!-- Composant FullCalendar pour afficher le calendrier -->
    <FullCalendar :options="calendarOptions" />

    <!-- Modale pour afficher les informations de la date cliquée -->
    <Modale :is-open="isModalOpened" :is-update="modalIsUpdate" @delete-schedule="deleteEvent" @edit-schedule="updateEvent" @add-schedule="addEvent" @modal-close="closeModal">
        <template #header>
            <h3>Planification d'événement</h3>
        </template>
        <template #content>
            <form @submit.prevent="addEvent">
                <div class="form-group">
                    <label for="title">Titre</label>
                    <input id="title" v-model="scheduleForm.name" type="text" class="form-control" placeholder="Titre de l'événement" required />
                </div>
                <div class="form-group">
                    <label for="startDate">Date de début</label>
                    <input id="startDate" v-model="scheduleForm.startDate" type="date" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="startTime">Heure de début</label>
                    <input id="startTime" v-model="scheduleForm.startTime" type="time" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="endDate">Date de fin</label>
                    <input id="endDate" v-model="scheduleForm.endDate" type="date" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="endTime">Heure de fin</label>
                    <input id="endTime" v-model="scheduleForm.endTime" type="time" class="form-control" required />
                </div>

                <div class="card p-3">
                    <div v-for="day in days" :key="day.id" class="form-check">
                        <input :id="day.id + ''" v-model="scheduleForm.byDay" type="checkbox" class="form-check-input" :value="day.id" />
                        <label class="form-check-label" :for="day.id + ''">{{ day.name }}</label>
                    </div>
                </div>
                <input v-model="scheduleForm.id" type="hidden" />
            </form>
        </template>
    </Modale>
</template>

<style scoped>
/* Ajouter des styles personnalisés ici si nécessaire */
</style>
