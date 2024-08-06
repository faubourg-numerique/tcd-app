<script setup lang="ts">
import { reactive, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modale from "@/components/Modal-App-Planning.vue";
import { useScheduleStore } from "@/stores/schedule-store";
import type Schedule from "@/models/schedule";
import { all } from "axios";

const scheduleStore = useScheduleStore();

// Refs pour gérer l'état de la modale, la date cliquée, et les événements
const isModalOpened = ref(false);
const clickedDate = ref("");
const startDate = ref("");
const endDate = ref("");
const title = ref("");

// Fonction pour ouvrir la modale avec la date cliquée
const openModal = (date: string) => {
    clickedDate.value = date;
    startDate.value = new Date(date).toISOString().slice(0, 16);
    endDate.value = new Date(date).toISOString().slice(0, 16);
    isModalOpened.value = true;
};

// Fonction pour fermer la modale
const closeModal = () => {
    isModalOpened.value = false;
};
const allSchedules = ref<{ title: string; start: string; end: string }[]>([]);

const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    locale: "fr",
    events: allSchedules.value, // Lier les événements au calendrier
    dateClick: ({ dateStr }: { dateStr: string }) => {
        openModal(dateStr);
    },
});

// Fonction pour ajouter un événement
const addEvent = () => {
    const actualDate = new Date();

    if (new Date(startDate.value) < actualDate) {
        alert("La date de début doit être supérieure à la date actuelle");
        return;
    }

    const schedule: Schedule = {
        title: title.value,
        start: startDate.value.slice(0, 16),
        end: endDate.value.slice(0, 16),
        userName: "",
        id: null,
    };
    allSchedules.value = [];

    scheduleStore.addSchedule(schedule);
    scheduleStore.schedules.forEach((scheduleOne) => {
        allSchedules.value.push({
            title: scheduleOne.title,
            start: scheduleOne.start,
            end: scheduleOne.end,
        });
    });
    calendarOptions.value = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        locale: "fr",
        events: allSchedules.value, // Lier les événements au calendrier
        dateClick: ({ dateStr }: { dateStr: string }) => {
            openModal(dateStr);
        },
    };
    closeModal(); // Fermer la modale après ajout
};

</script>

<template>
    <!-- Composant FullCalendar pour afficher le calendrier -->
    <FullCalendar :options="calendarOptions" />

    <!-- Modale pour afficher les informations de la date cliquée -->
    <Modale :is-open="isModalOpened" @modal-close="closeModal">
        <template #header>
            <h3>Planification d'événement</h3>
        </template>
        <template #content>
            <form @submit.prevent="addEvent">
                <div class="form-group">
                    <label for="title">Titre</label>
                    <input id="title" v-model="title" type="text" class="form-control" placeholder="Titre de l'événement" required />
                </div>
                <div class="form-group">
                    <label for="startDate">Date de début</label>
                    <input id="startDate" v-model="startDate" type="datetime-local" class="form-control" required />
                </div>
                <div class="form-group">
                    <label for="endDate">Date de fin</label>
                    <input id="endDate" v-model="endDate" type="datetime-local" class="form-control" required />
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Ajouter</button>
                </div>
            </form>
        </template>
        <template #footer>
            <button class="btn btn-primary" @click="addEvent">Ajouter une planification</button>
            <button class="btn btn-secondary" @click="closeModal">Fermer</button>
        </template>
    </Modale>
</template>

<style scoped>
/* Ajouter des styles personnalisés ici si nécessaire */
</style>
