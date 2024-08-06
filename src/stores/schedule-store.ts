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
        /*schedules.length = 0;
        const response = await mainStore.api.get("/schedules");
        schedules.push(...response.data);*/
    }

    async function addSchedule(data: Schedule) {
        schedules.push(data);
        //await mainStore.api.post("/schedules", data);
    }

    async function updateSchedule(scheduleId: string, data: Object) {
        //await mainStore.api.patch(`/schedules/${scheduleId}`, data);
    }

    async function deleteSchedule(scheduleId: string) {
        //await mainStore.api.delete(`/schedules/${scheduleId}`);
    }

    function $reset() {
        schedules.length = 0;
    }

    return { schedules, getSchedule, fetchSchedules, $reset, updateSchedule, deleteSchedule, addSchedule };
});
