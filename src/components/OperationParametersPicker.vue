<script setup lang="ts">
import { useOperationStore } from "@/stores/operation-store";
import { useOperationParametersStore } from "@/stores/operation-parameters-store";

const selectedOperationId = defineModel("selectedOperationId");
const selectedOperationParametersId = defineModel("selectedOperationParametersId");

const operationStore = useOperationStore();
const operationParametersStore = useOperationParametersStore();

async function runOperation() {
    await operationStore.runOperation(selectedOperationParametersId.value as string);
}
</script>

<template>
    <form class="bg-white p-4 rounded text-center border border-danger" @submit.prevent="runOperation">
        <div class="mb-3">
            <label for="has-operation" class="form-label">{{ $t("main.operation") }}</label>
            <select id="has-operation" v-model="selectedOperationId" class="form-select" required>
                <option :value="null" disabled>-</option>
                <option v-for="operation in operationStore.operations" :key="operation.id" :value="operation.id">{{ operation.name }}</option>
            </select>
        </div>
        <div v-if="selectedOperationId">
            <label for="has-operation-parameters" class="form-label">{{ $t("main.parameters") }}</label>
            <select id="has-operation-parameters" v-model="selectedOperationParametersId" class="form-select" required>
                <option :value="null" disabled>{{ $t("main.selectParameters") }}</option>
                <option v-for="operationParameters in operationParametersStore.getOperationParametersByOperationId(selectedOperationId as string)" :key="operationParameters.id" :value="operationParameters.id">{{ operationParameters.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">{{ $t("main.submit") }}</button>
    </form>
</template>
