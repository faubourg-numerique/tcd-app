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

    async function fetchOperationSchedules() {
        operationSchedules.length = 0;
        const response = await mainStore.api.get("/operation-schedules");
        operationSchedules.push(...response.data);
    }

    function $reset() {
        operationSchedules.length = 0;
    }

    return { operationSchedules, getOperationSchedule, fetchOperationSchedules, $reset };
});
