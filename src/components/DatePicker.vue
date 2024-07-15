<template>
    <div class="row">
        <div class="col-md-6 mb-3">
            <label for="fromDate">From Date</label>
            <input id="fromDate" v-model="fromDate" class="form-control" type="datetime-local" @change="emitUpdate" />
        </div>
        <div class="col-md-6 mb-3">
            <label for="toDate">To Date</label>
            <input id="toDate" v-model="toDate" class="form-control" type="datetime-local" @change="emitUpdate" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";

const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;

const props = defineProps({
    initialFromDate: Date,
    initialToDate: Date,
});

const emits = defineEmits(["updateDates"]);

const fromDate = ref<Date>(new Date(new Date().getTime() - sevenDaysInMilliseconds));
const toDate = ref<Date>(new Date());

watch(
    [() => props.initialFromDate, () => props.initialToDate],
    ([newFromDate, newToDate]) => {
        fromDate.value = newFromDate || fromDate.value;
        toDate.value = newToDate || toDate.value;
    },
    { immediate: true },
);

const emitUpdate = () => {
    emits("updateDates", { fromDate: fromDate.value, toDate: toDate.value });
};
</script>

<style scoped>
input[type="datetime-local"] {
    background-color: #f0f0f0;
    color: #333;
    border: 2px solid #dc3545;
    border-radius: 4px;
    padding: 10px;
    font-size: 16px;
}

input[type="datetime-local"]::placeholder {
    color: #888;
}

input[type="datetime-local"]:focus {
    border-color: #b32a38;
    box-shadow: 0 0 5px rgba(0, 91, 187, 0.5);
}
</style>
