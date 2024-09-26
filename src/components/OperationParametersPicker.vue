<script setup lang="ts">
import { defineProps, computed } from "vue";
import { useOperationStore } from "@/stores/operation-store";
import { useOperationParametersStore } from "@/stores/operation-parameters-store";
import { useI18n } from "vue-i18n";

const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    },
});

const { t } = useI18n();
const operationStore = useOperationStore();
const operationParametersStore = useOperationParametersStore();

const operations = operationStore.operations;
console.log(operationStore);
const selectedOperationId = defineModel("selectedOperationId");
const selectedOperationParametersId = defineModel("selectedOperationParametersId");

function getOperationParameters(operationId: string) {
    return operationParametersStore.getOperationParametersByOperationId(operationId);
}

async function runOperation() {
    await operationStore.runOperation(selectedOperationParametersId.value as string);
}
</script>
<template>
    <form class="bg-white p-4 rounded text-center border border-danger" @submit.prevent="runOperation">
        <div class="mb-3">
            <label for="has-operation" class="form-label">{{ t("main.operation") }}</label>
            <select v-model="selectedOperationId" id="has-operation" class="form-select" required>
                <option :value="null" disabled>-</option>
                <option v-for="operation in operations" :key="operation.id" :value="operation.id">{{ operation.name }}</option>
            </select>
        </div>
        <div v-if="selectedOperationId">
            <label for="has-operation-parameters" class="form-label">{{ t("main.parameters") }}</label>
            <select v-model="selectedOperationParametersId" id="has-operation-parameters" class="form-select" required>
                <option :value="null" disabled>{{ t("main.selectParameters") }}</option>
                <option v-for="operationParameters in getOperationParameters(selectedOperationId as string)" :key="operationParameters.id" :value="operationParameters.id">{{ operationParameters.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">{{ t("main.submit") }}</button>
    </form>
</template>
<style scoped>
/* Ajoute des styles ici si nécessaire */
</style>
