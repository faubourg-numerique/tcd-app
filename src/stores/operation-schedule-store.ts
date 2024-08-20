import { defineStore } from "pinia";
import { reactive } from "vue";

import OperationScheduleNotFoundError from "@/errors/NotFoundError/OperationScheduleNotFoundError";
import type { OperationSchedule } from "@/models/OperationSchedule";
import { useMainStore } from "@/stores/main-store";

export const useOperationScheduleStore = defineStore("operation-schedule", () => {
    const mainStore = useMainStore();

    const operationSchedules: OperationSchedule[] = reactive([]);

    function getOperationSchedule(operationScheduleId: string) {
        const operationSchedule = operationSchedules.find((operationSchedule) => operationSchedule.id === operationScheduleId);
        if (!operationSchedule) {
            throw new OperationScheduleNotFoundError(operationScheduleId);
        }
        return operationSchedule;
    }

    function getOperationSchedulesByZoneId(zoneId: string) {
        return operationSchedules.filter((operationSchedule) => operationSchedule.hasZone === zoneId);
    }

    async function fetchOperationSchedules() {
        operationSchedules.length = 0;
        const response = await mainStore.api.get("/operation-schedules");
        operationSchedules.push(...response.data);
    }

    async function createOperationSchedule(operationSchedule: OperationSchedule) {
        await mainStore.api.post("/operation-schedules", operationSchedule);
        await fetchOperationSchedules();
    }

    async function updateOperationSchedule(operationSchedule: OperationSchedule) {
        await mainStore.api.patch(`/operation-schedules/${operationSchedule.id}`, operationSchedule);
        await fetchOperationSchedules();
    }

    async function deleteOperationSchedule(operationSchedule: OperationSchedule) {
        await mainStore.api.delete(`/operation-schedules/${operationSchedule.id}`);
        await fetchOperationSchedules();
    }

    function $reset() {
        operationSchedules.length = 0;
    }

    return { operationSchedules, getOperationSchedule, getOperationSchedulesByZoneId, fetchOperationSchedules, createOperationSchedule, updateOperationSchedule, deleteOperationSchedule, $reset };
});
