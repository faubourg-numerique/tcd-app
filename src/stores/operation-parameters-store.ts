import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import OperationParametersNotFoundError from "@/errors/NotFoundError/OperationParametersNotFoundError";

import type OperationParameters from "@/types/OperationParameters";

export const useOperationParametersStore = defineStore("operation-parameters", () => {
    const operationParameters: OperationParameters[] = reactive([]);

    function getOperationParameters(operationParametersId: string) {
        const _operationParameters = operationParameters.find((operationParameters) => operationParameters.id === operationParametersId);
        if (!_operationParameters) {
            throw new OperationParametersNotFoundError(operationParametersId);
        }
        return _operationParameters;
    }

    function getOperationParametersByOperationId(operationId: string) {
        return operationParameters.filter((operationParameters) => operationId === operationParameters.hasOperation)
    }

    async function fetchOperationParameters() {
        $reset();
        const response = await api.get("/operation-parameters");
        operationParameters.push(...response.data);
    }

    function $reset() {
        operationParameters.length = 0;
    }

    return { operationParameters, getOperationParameters, getOperationParametersByOperationId, fetchOperationParameters, $reset };
});
