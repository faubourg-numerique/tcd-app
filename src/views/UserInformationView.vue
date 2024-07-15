<script setup lang="ts">
import { useMainStore } from "@/stores/main-store";

const mainStore = useMainStore();
console.log(mainStore.roles);
</script>

<template>
    <div class="container mt-5">
        <h3 class="mb-4">Rôles de l'utilisateur</h3>
        <div class="d-flex flex-wrap justify-content-start">
            <div v-for="role in mainStore.roles" :key="role" class="p-2">
                <div class="badge bg-danger text-wrap">
                    {{ role }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    border: 2px solid #dc3545;
    border-radius: 0.25rem;
    padding: 1rem;
}
</style>
