<script setup lang="ts">
import { useMainStore } from "@/stores/main-store";
import { useUserStore } from "@/stores/user-store";
import { ref, computed, onMounted } from "vue";

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
    try {
        const userData = await userStore.getUsers();
        if (userData) {
            user.value = {
                gristApiKey: userData.gristApiKey?.value || "",
                gristDocId: userData.gristDocId?.value || ""
            };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des préférences:", error);
    }
}

// Enregistrer les modifications
async function savePreferences() {
    try {
        const updatedData = {
            gristApiKey: { type: "Property", value: user.value.gristApiKey },
            gristDocId: { type: "Property", value: user.value.gristDocId }
        };

        await userStore.updateUserPreferences(updatedData);
        alert("Préférences mises à jour !");
    } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        alert("Erreur lors de la sauvegarde des préférences !");
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
            <span v-for="(role, index) in mainStore.roles" :key="index" class="badge bg-danger text-wrap">
                {{ role }}
            </span>
        </div>
    </div>

    <!-- Formulaire des préférences Grist -->
    <div class="container mt-5">
        <h3 class="mb-4">GRIST Préférences</h3>

        <form @submit.prevent="savePreferences">
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

            <button type="submit" class="btn btn-primary">Sauvegarder</button>
        </form>
    </div>
</template>

<style scoped>
.gap-2 {
    gap: 8px;
}
</style>
