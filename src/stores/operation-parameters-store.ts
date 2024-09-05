import { defineStore } from "pinia";
import { reactive } from "vue";

import OperationParametersNotFoundError from "@/errors/NotFoundError/OperationParametersNotFoundError";
import type { OperationParameters } from "@/models/OperationParameters";
import { useMainStore } from "@/stores/main-store";

export const useOperationParametersStore = defineStore("operation-parameters", () => {
    const mainStore = useMainStore();

    const operationParameters: OperationParameters[] = reactive([]);

    function getOperationParameters(operationParametersId: string) {
        const _operationParameters = operationParameters.find((operationParameters) => operationParameters.id === operationParametersId);
        if (!_operationParameters) {
            throw new OperationParametersNotFoundError(operationParametersId);
        }
        return _operationParameters;
    }

    function getOperationParametersByOperationId(operationId: string) {
        return operationParameters.filter((_operationParameters) => _operationParameters.hasOperation === operationId);
    }

    async function fetchOperationParameters() {
        operationParameters.length = 0;
        const response = await mainStore.api.get("/operation-parameters");
        operationParameters.push(...response.data);
    }

    function $reset() {
        operationParameters.length = 0;
    }

    return { operationParameters, getOperationParameters, getOperationParametersByOperationId, fetchOperationParameters, $reset };
});
