<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useMainStore } from "@/stores/main-store";

const mainStore = useMainStore();
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <span class="navbar-brand d-flex align-items-center">
                <img alt="Somme Numérique" class="logo" src="@/assets/images/logos/somme-numerique.png" width="50" height="50" />
                <span class="ms-2 d-none d-sm-inline text-danger">{{ $t("nav.mainTitle") }}</span>
            </span>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div v-if="mainStore.isAuthenticated && mainStore.isAuthorized" id="navbarNav" class="collapse navbar-collapse justify-content-end">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link" :to="{ name: 'dashboard' }">{{ $t("nav.Dashboard") }}</RouterLink>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{ $t("nav.myResponsibilities") }}</a>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item bi bi-houses-fill" :to="{ name: 'responsibilities.buildings' }">{{ $t("nav.Buildings") }}</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item bi bi-lightbulb-fill" :to="{ name: 'responsibilities.lighting' }">{{ $t("nav.Lighting") }}</RouterLink>
                            </li>
                            
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle " href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{ $t("nav.DemoVisualisation") }}</a>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item bi  bi-graph-down" :to="{ name: 'water-level' }">{{ $t("nav.waterLevel") }}</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item bi bi-graph-down" :to="{ name: 'indoor-ambiance' }">{{ $t("nav.indoorAmbiance") }}</RouterLink>
                            </li>
                            
                        </ul>
                    </li>
                    <li class="nav-item d-flex align-items-center">
                        <span class="bi bi-person-circle me-2">{{ mainStore.username }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar-brand img {
    margin-right: 10px;
}

.navbar-nav .nav-item .nav-link {
    color: #333;
}

.navbar-nav .nav-item .nav-link:hover {
    color: #0056b3;
}

.navbar-nav .nav-item span {
    color: #333;
}

.navbar-brand img {
    margin-right: 10px;
}

.nav-link {
    color: #333;
    padding: 0 15px;
}

.nav-link i {
    margin-right: 5px;
}
</style>
