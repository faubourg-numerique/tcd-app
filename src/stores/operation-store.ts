import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import OperationNotFoundError from "@/errors/NotFoundError/OperationNotFoundError";

import type { Operation } from "@/types/Operation";

export const useOperationStore = defineStore("operation", () => {
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
        $reset();
        const response = await api.get("/operations");
        operations.push(...response.data);
    }

    function $reset() {
        operations.length = 0;
    }

    return { operations, getOperation, getOperationsByZoneId, fetchOperations, $reset };
});
