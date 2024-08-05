<script setup lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modale from "@/components/Modal-App-Planning.vue";

// Refs pour gérer l'état de la modale, la date cliquée, et les événements
const isModalOpened = ref(false);
const clickedDate = ref('');
const events = ref<{ title: string; start: string; allDay: boolean; }[]>([]);  // Liste réactive des événements

// Fonction pour ouvrir la modale avec la date cliquée
const openModal = (date: string) => {
  clickedDate.value = date;
  isModalOpened.value = true;
};

// Fonction pour fermer la modale
const closeModal = () => {
  isModalOpened.value = false;
};

// Fonction pour ajouter un événement
const addEvent = () => {
  events.value.push({
    title: 'Nouvel Événement',  // Titre par défaut ou à saisir via la modale
    start: clickedDate.value,
    allDay: true
  });
  closeModal();  // Fermer la modale après ajout
};

// Options de configuration pour FullCalendar
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: 'fr',
  events: events.value,  // Lier les événements au calendrier
  dateClick: ({ dateStr }: { dateStr: string }) => {
    openModal(dateStr);
  }
});
</script>

<template>
  <!-- Composant FullCalendar pour afficher le calendrier -->
  <FullCalendar :options="calendarOptions" />

  <!-- Modale pour afficher les informations de la date cliquée -->
  <Modale :isOpen="isModalOpened" @modal-close="closeModal">
    <template #header>
      <h3>Planification pour le {{ clickedDate }}</h3>
    </template>
    <template #content>
      <p>Vous avez cliqué sur : {{ clickedDate }}</p>
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
