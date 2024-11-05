<script setup lang="ts">
import swal from "sweetalert2";

import { useI18n } from "vue-i18n";
import { computed, onMounted, watch } from "vue";

import { useOperationParametersStore } from "@/stores/operation-parameters-store";
import { useOperationStore } from "@/stores/operation-store";

const props = defineProps<{ zoneId: string }>();

const { t } = useI18n();

const selectedOperationId = defineModel("selectedOperationId");
const selectedOperationParametersId = defineModel("selectedOperationParametersId");

const operationStore = useOperationStore();
const operationParametersStore = useOperationParametersStore();

async function runOperation() {
    if (!selectedOperationParametersId.value) {
        return;
    }

    try {
        await operationStore.runOperation(selectedOperationParametersId.value as string);
    } catch(error) {
        await swal.fire({
            icon: "success",
            title: t("dialogs.operationRunErrorTitle"),
            text: t("dialogs.operationRunErrorText"),
        });
        return;
    }

    await swal.fire({
        icon: "success",
        title: t("dialogs.operationRunSuccessTitle"),
        text: t("dialogs.operationRunSuccessText"),
    });
}

function setSelectedOperationId(zoneId: string) {
    const operations = operationStore.getOperationsByZoneId(zoneId as string);
    selectedOperationId.value = operations.length === 1 ? operations[0].id : null;
}

function sortedOperationParameters(operationId: string) {
    const operationParameters = operationParametersStore.getOperationParametersByOperationId(operationId);
    operationParameters.sort((a, b) => a.name.localeCompare(b.name));
    return operationParameters;
}

onMounted(() => setSelectedOperationId(props.zoneId));

watch(() => props.zoneId, setSelectedOperationId);

watch(selectedOperationId, (operationId) => {
    const operationParameters = operationParametersStore.getOperationParametersByOperationId(operationId as string);
    selectedOperationParametersId.value = operationParameters.length === 1 ? operationParameters[0].id : null;
});
</script>

<template>
    <form class="bg-white p-4 rounded text-center border border-danger" @submit.prevent="runOperation">
        <div class="mb-3">
            <label for="has-operation" class="form-label">{{ $t("main.operation") }}</label>
            <select id="has-operation" v-model="selectedOperationId" class="form-select" required>
                <option :value="null" disabled>-</option>
                <option v-for="operation in operationStore.getOperationsByZoneId(props.zoneId)" :key="operation.id" :value="operation.id">{{ operation.name }}</option>
            </select>
        </div>
        <div v-if="selectedOperationId">
            <label for="has-operation-parameters" class="form-label">{{ $t("main.parameters") }}</label>
            <select id="has-operation-parameters" v-model="selectedOperationParametersId" class="form-select" required>
                <option :value="null" disabled>{{ $t("main.selectParameters") }}</option>
                <option v-for="operationParameters in sortedOperationParameters(selectedOperationId as string)" :key="operationParameters.id" :value="operationParameters.id">{{ operationParameters.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">{{ $t("main.submit") }}</button>
    </form>
</template>
