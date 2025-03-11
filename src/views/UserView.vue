<!-- eslint-disable vue/attributes-order -->
<script setup lang="ts">
import { useMainStore } from "@/stores/main-store";
import { useUserStore } from "@/stores/user-store";
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";

const mainStore = useMainStore();
const userStore = useUserStore();

const user = ref({
    gristApiKey: "",
    gristDocId: "", 
    gristBaseUrl: ""
});

const preferencesLoaded = ref(false);


const userEmail = computed(() => mainStore.user?.email || "Email non disponible");

async function fetchUserPreferences() {
    if (!mainStore.user?.email) return;

    try {
        const userData = await userStore.fetchUserPreferences(mainStore.user.email);
        if (userData) {
            user.value = {
                gristApiKey: userData.gristApiKey || "Configurez votre clé API Grist",
                gristDocId: userData.gristDocId || "Configurez votre ID de document Grist",
                gristBaseUrl: userData.gristBaseUrl || "Configurez votre URL de base Grist"
            };
            preferencesLoaded.value = true;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des préférences:", error);
    }
}

// Mettre à jour les préférences
async function updatePreferences() {
    if (!mainStore.user?.email) return;

    try {
        await userStore.updateUserPreferences(mainStore.user.email, user.value.gristApiKey, user.value.gristDocId , user.value.gristBaseUrl);
        Swal.fire({
            title: "Succès",
            text: "Préférences mises à jour avec succès !",
            icon: "success",
            confirmButtonText: "OK"
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour des préférences:", error);
    }
}

onMounted(() => {
    fetchUserPreferences();
});
</script>

<template>
    <div class="container mt-5">
        <h3 class="mb-4">{{ $t("main.roles") }}</h3>
        <div class="d-flex flex-wrap justify-content-start gap-2">
            <span v-for="(role, index) in mainStore.roles" :key="index" class="badge bg-danger text-wrap">{{ role }}</span>
        </div>
    </div>

    <div v-if="preferencesLoaded" class="container mt-5">
        <h3 class="mb-4">GRIST Préférences</h3>

        <form @submit.prevent="updatePreferences">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input id="email" type="email" class="form-control" :value="userEmail" disabled />
            </div>

            <div class="mb-3">
                <label for="gristApiKey" class="form-label">Grist API Key</label>
                <input id="gristApiKey" v-model="user.gristApiKey" type="text" class="form-control" />
            </div>

            <div class="mb-3">
                <label for="gristDocId" class="form-label">Grist Doc ID</label>
                <input id="gristDocId" v-model="user.gristDocId" type="text" class="form-control" />
            </div>

            <div class="mb-3">
                <label for="gristBaseUrl" class="form-label">Grist Base Url</label>
                <select id="gristBaseUrl" v-model="user.gristBaseUrl" class="form-control">
                    <option value="https://docs.getgrist.com/api/docs">Grist Standard</option>
                    <option value="https://grist.incubateur.anct.gouv.fr/api/docs">Grist Global / ANCT</option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    </div>
</template>

<style scoped>
.gap-2 {
    gap: 8px;
}
</style>