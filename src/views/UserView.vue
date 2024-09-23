<script setup lang="ts">
import { useMainStore } from "@/stores/main-store";

const mainStore = useMainStore();
</script>

<template>
    <div class="container mt-5">
        <h3 class="mb-4">{{ $t("main.roles") }}</h3>
        <div class="d-flex flex-wrap justify-content-start">
            <div v-for="(role, index) in mainStore.roles" :key="index" class="m-2">
                <div class="badge bg-danger text-wrap">{{ role }}</div>
            </div>
        </div>
    </div>
</template>
