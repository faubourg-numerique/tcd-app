import { defineStore } from "pinia";
import { reactive } from "vue";

import OperationNotFoundError from "@/errors/NotFoundError/OperationNotFoundError";
import type { Operation } from "@/models/Operation";
import { useMainStore } from "@/stores/main-store";

export const useOperationStore = defineStore("operations", () => {
    const mainStore = useMainStore();

    const operations: Operation[] = reactive([]);

    function getOperation(operationId: string) {
        const operation = operations.find((operation) => operation.id === operationId);
        if (!operation) {
            throw new OperationNotFoundError(operationId);
        }
        return operation;
    }

    function getOperationsByZoneId(zoneId: string) {
        return operations.filter((operation) => operation.hasZone === zoneId);
    }

    async function fetchOperations() {
        operations.length = 0;
        const response = await mainStore.api.get("/operations");
        operations.push(...response.data);
    }

    async function createOperation(operation: Operation) {
        await mainStore.api.post("/operations", operation);
        await fetchOperations();
    }

    async function updateOperation(operation: Operation) {
        await mainStore.api.patch(`/operations/${operation.id}`, operation);
        await fetchOperations();
    }

    async function deleteOperation(operation: Operation) {
        await mainStore.api.delete(`/operations/${operation.id}`);
        await fetchOperations();
    }

    function $reset() {
        operations.length = 0;
    }

    return { operations, getOperation, getOperationsByZoneId, fetchOperations, createOperation, updateOperation, deleteOperation, $reset };
});
