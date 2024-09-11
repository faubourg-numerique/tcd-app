import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import OperationScheduleNotFoundError from "@/errors/NotFoundError/OperationScheduleNotFoundError";

import type OperationSchedule from "@/types/OperationSchedule";

export const useOperationScheduleStore = defineStore("operation-schedule", () => {
    const operationSchedules: OperationSchedule[] = reactive([]);

    function getOperationSchedule(operationScheduleId: string) {
        const operationSchedule = operationSchedules.find((operationSchedule) => operationSchedule.id === operationScheduleId);
        if (!operationSchedule) {
            throw new OperationScheduleNotFoundError(operationScheduleId);
        }
        return operationSchedule;
    }

    function getOperationScheduleIndex(operationScheduleId: string) {
        const index = operationSchedules.findIndex((operationSchedule) => operationSchedule.id === operationScheduleId);
        if (index === -1) {
            throw new OperationScheduleNotFoundError(operationScheduleId);
        }
        return index;
    }

    function getOperationSchedulesByZoneId(zoneId: string) {
        return operationSchedules.filter((operationSchedule) => operationSchedule.hasZone === zoneId);
    }

    async function fetchOperationSchedules() {
        $reset();
        const response = await api.get("/operation-schedules");
        operationSchedules.push(...response.data);
    }

    async function createOperationSchedule(operationSchedule: OperationSchedule) {
        const response = await api.post("/operation-schedules", operationSchedule);
        operationSchedules.push(response.data);
        return response.data;
    }

    async function updateOperationSchedule(operationSchedule: OperationSchedule) {
        const index = getOperationScheduleIndex(operationSchedule.id);
        const response = await api.put(`/operation-schedules/${operationSchedule.id}`, operationSchedule);
        operationSchedules[index] = response.data;
        return response.data;
    }

    async function deleteOperationSchedule(operationSchedule: OperationSchedule) {
        const index = getOperationScheduleIndex(operationSchedule.id);
        await api.delete(`/operation-schedules/${operationSchedule.id}`);
        operationSchedules.splice(index, 1);
    }

    function $reset() {
        operationSchedules.length = 0;
    }

    return { operationSchedules, getOperationSchedule, getOperationSchedulesByZoneId, fetchOperationSchedules, createOperationSchedule, updateOperationSchedule, deleteOperationSchedule, $reset };
});
