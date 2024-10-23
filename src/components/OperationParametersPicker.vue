<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOperationParametersStore } from "@/stores/operation-parameters-store";
import { useOperationStore } from "@/stores/operation-store";
import Swal from "sweetalert2";
import { useI18n } from 'vue-i18n'; 

const selectedOperationId = defineModel<string | null>("selectedOperationId");
const selectedOperationParametersId = defineModel<string | null>("selectedOperationParametersId");

const operationStore = useOperationStore();
const operationParametersStore = useOperationParametersStore();
const { t } = useI18n();

const sortedOperationParameters = computed(() => {
    if (!selectedOperationId.value) return [];
    return operationParametersStore
        .getOperationParametersByOperationId(selectedOperationId.value)
        .slice() 
        .sort((a, b) => a.name.localeCompare(b.name)); 
});

async function runOperation() {
    try {
        if (!selectedOperationParametersId.value) {
            throw new Error('Operation parameters ID is required');
        }
        await operationStore.runOperation(selectedOperationParametersId.value as string);
        Swal.fire({
            icon: 'success',
            title: t("main.Done"),
            text: t("main.operationExecutedSuccessfully"), 
        }); 
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: t("main.error"),
            text: error instanceof Error ? error.message : t("main.operationExecutionFailed"), 
        });
    }
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
    
                <option v-for="operationParameters in sortedOperationParameters" :key="operationParameters.id" :value="operationParameters.id">{{ operationParameters.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="!selectedOperationId || !selectedOperationParametersId">{{ $t("main.apply") }}</button>
    </form>
</template>
