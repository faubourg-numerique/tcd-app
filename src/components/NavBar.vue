<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useMainStore } from "@/stores/main-store";

const mainStore = useMainStore();

const logoutUrl = `${import.meta.env.VITE_IDENTITY_MANAGER_URL}/auth/external_logout?_method=DELETE&client_id=${import.meta.env.VITE_IDENTITY_MANAGER_APP_CLIENT_ID}`;
</script>

<template>
    <nav class="navbar navbar-expand-xl navbar-light bg-light">
        <div class="container-fluid">
            <span class="navbar-brand d-flex align-items-center">
                <img alt="dRural" class="logo" src="@/assets/images/logos/drural.png" width="68" height="50" />
                <img alt="Somme Numérique" class="logo" src="@/assets/images/logos/somme-numerique.png" width="50" height="50" />
                <span class="ms-2 d-none d-sm-inline text-danger">{{ $t("main.title") }}</span>
            </span>
            <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbar-nav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div v-if="mainStore.isAuthenticated && mainStore.isAuthorized" id="navbar-nav" class="collapse navbar-collapse justify-content-end">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link" :to="{ name: 'dashboard' }">{{ $t("main.dashboard") }}</RouterLink>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">{{ $t("main.myResponsibilities") }}</a>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item" :to="{ name: 'responsibilities.buildings' }"><FontAwesomeIcon :icon="['fas', 'recycle']" class="me-2" />{{ $t("main.buildings") }}</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" :to="{ name: 'responsibilities.lighting' }"><FontAwesomeIcon :icon="['fas', 'lightbulb']" class="me-2" />{{ $t("main.lighting") }}</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" :to="{ name: 'responsibilities.watercourses' }"><FontAwesomeIcon :icon="['fas', 'water']" class="me-2" />{{ $t("main.watercourses") }}</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" :to="{ name: 'responsibilities.voluntaryContributionPoints' }"><FontAwesomeIcon :icon="['fas', 'recycle']" class="me-2" />{{ $t("main.voluntaryContributionPoints") }}</RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown d-flex align-items-center">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"><FontAwesomeIcon :icon="['fas', 'user']" class="me-2" />{{ mainStore.username }}</a>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item bi bi-graph-down" :to="{ name: 'user' }">{{ $t("main.informations") }}</RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a :href="logoutUrl">
                            <FontAwesomeIcon :icon="['fas', 'right-from-bracket']" />
                        </a>
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
