import { createRouter, createWebHistory } from "vue-router";

import { useMainStore } from "@/stores/main-store";
import DashboardView from "@/views/DashboardView.vue";
import OAuth2CallbackView from "@/views/OAuth2CallbackView.vue";
import ResponsibilitiesBuildingsView from "@/views/ResponsibilitiesBuildingsView.vue";
import ResponsibilitiesLightingView from "@/views/ResponsibilitiesLightingView.vue";
import ResponsibilitiesVoluntaryContributionPointsDetailsView from "@/views/ResponsibilitiesVoluntaryContributionPointsDetailsView.vue";
import ResponsibilitiesVoluntaryContributionPointsView from "@/views/ResponsibilitiesVoluntaryContributionPointsView.vue";
import ResponsibilitiesWatercoursesDetailsView from "@/views/ResponsibilitiesWatercoursesDetailsView.vue";
import ResponsibilitiesWatercoursesView from "@/views/ResponsibilitiesWatercoursesView.vue";
import UnauthorizedView from "@/views/UnauthorizedView.vue";
import UserView from "@/views/UserView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/oauth2/callback",
            name: "oauth2.callback",
            component: OAuth2CallbackView,
        },
        {
            path: "/",
            name: "dashboard",
            component: DashboardView,
        },
        {
            path: "/responsibilities/buildings",
            name: "responsibilities.buildings",
            component: ResponsibilitiesBuildingsView,
        },
        {
            path: "/responsibilities/lighting",
            name: "responsibilities.lighting",
            component: ResponsibilitiesLightingView,
        },
        {
            path: "/responsibilities/watercourses",
            name: "responsibilities.watercourses",
            component: ResponsibilitiesWatercoursesView,
        },
        {
            path: "/responsibilities/watercourses/:deviceMeasurementId",
            name: "responsibilities.watercourses.details",
            component: ResponsibilitiesWatercoursesDetailsView,
        },
        {
            path: "/responsibilities/voluntary-contribution-points",
            name: "responsibilities.voluntaryContributionPoints",
            component: ResponsibilitiesVoluntaryContributionPointsView,
        },
        {
            path: "/responsibilities/voluntary-contribution-points/:deviceMeasurementId",
            name: "responsibilities.voluntaryContributionPoints.details",
            component: ResponsibilitiesVoluntaryContributionPointsDetailsView,
        },
        {
            path: "/unauthorized",
            name: "unauthorized",
            component: UnauthorizedView,
        },
        {
            path: "/user",
            name: "user",
            component: UserView,
        },
    ],
});

router.beforeEach((to) => {
    const mainStore = useMainStore();
    if (!mainStore.isAuthenticated && to.name !== "oauth2.callback") {
        window.location.href = `${import.meta.env.VITE_IDENTITY_MANAGER_URL}/oauth2/authorize?client_id=${import.meta.env.VITE_IDENTITY_MANAGER_APP_CLIENT_ID}&response_type=token&redirect_uri=${import.meta.env.VITE_IDENTITY_MANAGER_APP_REDIRECT_URI}&state=false`;
        return false;
    }
});

export default router;
