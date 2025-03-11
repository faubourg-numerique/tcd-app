<script setup lang="ts">
import { useMainStore } from "@/stores/main-store";
import { useUserStore } from "@/stores/user-store";
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";

const mainStore = useMainStore();
const userStore = useUserStore();

const user = ref({
    gristApiKey: "",
    gristDocId: ""
});

// Récupérer l'email depuis Keyrock via mainStore
const userEmail = computed(() => mainStore.user?.email || "Email non disponible");

// Charger les préférences de l'utilisateur
async function fetchUserPreferences() {
    if (!mainStore.user?.email) return;

    try {
        const userData = await userStore.fetchUserPreferences(mainStore.user.email);
        if (userData) {
            user.value = {
                gristApiKey: userData.gristApiKey || "Configurez votre clé API Grist",
                gristDocId: userData.gristDocId || "Configurez votre ID de document Grist"
            };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des préférences:", error);
    }
}

// Mettre à jour les préférences
async function updatePreferences() {
    if (!mainStore.user?.email) return;

    try {
        await userStore.updateUserPreferences(mainStore.user.email, user.value.gristApiKey, user.value.gristDocId);
        Swal.fire({title: "Succès",text: "Préférences mises à jour avec succès !",icon: "success",confirmButtonText: "OK"});
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

    <div class="container mt-5">
        <h3 class="mb-4">GRIST Préférences</h3>

        <form @submit.prevent="updatePreferences">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" :value="userEmail" disabled />
            </div>

            <div class="mb-3">
                <label for="gristApiKey" class="form-label">Grist API Key</label>
                <input type="text" id="gristApiKey" class="form-control" v-model="user.gristApiKey" />
            </div>

            <div class="mb-3">
                <label for="gristDocId" class="form-label">Grist Doc ID</label>
                <input type="text" id="gristDocId" class="form-control" v-model="user.gristDocId" />
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