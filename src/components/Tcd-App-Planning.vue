<script setup lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modale from "@/components/Modal-App-Planning.vue";

const isModalOpened = ref(false);
const clickedDate = ref('');

const openModal = (date: string) => {
  clickedDate.value = date;
  isModalOpened.value = true;
};

const closeModal = () => {
  isModalOpened.value = false;
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  dateClick: ({ dateStr }: { dateStr: string }) => {
    openModal(dateStr);
  }
});
</script>

<template>
  <FullCalendar :options="calendarOptions" />
  <Modale :isOpen="isModalOpened" @modal-close="closeModal">
    <template #header>
      <h3>{{ clickedDate }}</h3>
    </template>
    <template #content>
      <p>You clicked on: {{ clickedDate }}</p>
    </template>
    <template #footer>
      <button @click="closeModal">Close</button>
    </template>
  </Modale>
</template>

<style scoped>

</style>
