<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import DatePicker from "../components/DatePicker.vue";

const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;

const fromDate = ref<Date>(new Date(new Date().getTime() - sevenDaysInMilliseconds));
const toDate = ref<Date>(new Date());

const indoorAmbiancePanel1Url = ref<string>("");
const indoorAmbiancePanel2Url = ref<string>("");
const indoorAmbiancePanel3Url = ref<string>("");
const indoorAmbiancePanel4Url = ref<string>("");
const indoorAmbiancePanel5Url = ref<string>("");

const dashboards = reactive([indoorAmbiancePanel1Url, indoorAmbiancePanel2Url, indoorAmbiancePanel3Url, indoorAmbiancePanel4Url, indoorAmbiancePanel5Url]);

const updateIframeUrl = () => {
    const fromDateUpdate = new Date(fromDate.value);
    const toDateUpdate = new Date(toDate.value);
    indoorAmbiancePanel1Url.value = import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_1_URL.replace("$dateFrom", fromDateUpdate.getTime().toString()).replace("$dateTo", toDateUpdate.getTime().toString());
    indoorAmbiancePanel2Url.value = import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_2_URL.replace("$dateFrom", fromDateUpdate.getTime().toString()).replace("$dateTo", toDateUpdate.getTime().toString());
    indoorAmbiancePanel3Url.value = import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_3_URL.replace("$dateFrom", fromDateUpdate.getTime().toString()).replace("$dateTo", toDateUpdate.getTime().toString());
    indoorAmbiancePanel4Url.value = import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_4_URL.replace("$dateFrom", fromDateUpdate.getTime().toString()).replace("$dateTo", toDateUpdate.getTime().toString());
    indoorAmbiancePanel5Url.value = import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_5_URL.replace("$dateFrom", fromDateUpdate.getTime().toString()).replace("$dateTo", toDateUpdate.getTime().toString());
};

const updateDates = (dates: { fromDate: Date; toDate: Date }) => {
    fromDate.value = dates.fromDate;
    toDate.value = dates.toDate;
    updateIframeUrl();
};

updateIframeUrl();
watch([fromDate, toDate], updateIframeUrl);
</script>

<template>
    <div class="container mt-5">
        <DatePicker :initial-from-date="fromDate" :initial-to-date="toDate" @update-dates="updateDates" />
        <div class="container">
            <h1 class="mb-4">{{ $t("nav.indoorAmbiance") }}</h1>
            <div class="row row-cols-1 row-cols-md-2 g-3">
                <div v-for="(panelUrl, index) in dashboards" :key="index" class="col">
                    <iframe :src="panelUrl.value" class="w-100" height="300"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
iframe {
    border: none;
    margin-bottom: 20px;
}
</style>
