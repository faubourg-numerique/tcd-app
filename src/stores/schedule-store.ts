import { defineStore } from "pinia";
import { reactive } from "vue";

import ScheduleNotFoundError from "@/errors/NotFoundError/ScheduleNotFoundError";
import type Schedule from "@/models/Schedule";
import { useMainStore } from "@/stores/main-store";

export const useScheduleStore = defineStore("schedule", () => {
    const mainStore = useMainStore();

    const schedules: Schedule[] = reactive([]);

    function getSchedule(scheduleId: string) {
        const schedule = schedules.find((schedule) => schedule.id === scheduleId);
        if (!schedule) {
            throw new ScheduleNotFoundError(scheduleId);
        }
        return schedule;
    }

    async function fetchSchedules() {
        schedules.length = 0;
        const response = await mainStore.api.get("/operation-schedules");

        schedules.push(...response.data);
    }

    async function addSchedule(data: Schedule) {
        const response = await mainStore.api.post("/operation-schedules", data);
        schedules.splice(0, schedules.length);
        schedules.push(...response.data);
    }

    async function updateSchedule(scheduleId: string, data: Object) {
        const response = await mainStore.api.patch(`/operation-schedules/${scheduleId}`, data);
        schedules.splice(0, schedules.length);
        schedules.push(...response.data);
    }

    async function deleteSchedule(scheduleId: string) {
        const response = await mainStore.api.delete(`/operation-schedules/${scheduleId}`);
        schedules.splice(0, schedules.length);
        console.log(response.data);
        schedules.push(...response.data);
    }

    function $reset() {
        schedules.length = 0;
    }

    return { schedules, getSchedule, fetchSchedules, $reset, updateSchedule, deleteSchedule, addSchedule };
});
