import { createRouter, createWebHistory } from "vue-router";

import { useMainStore } from "@/stores/main-store";
import DashboardView from "@/views/DashboardView.vue";
import OAuth2CallbackView from "@/views/OAuth2CallbackView.vue";
import ResponsibilitiesLightingView from "@/views/ResponsibilitiesLightingView.vue";
import ResponsibilitiesBuildingsView from "@/views/ResponsibilitiesBuildingsView.vue";
import UnauthorizedView from "@/views/UnauthorizedView.vue";
import WaterLevelView from "@/views/WaterLevelView.vue";
import IndoorAmbianceView from "@/views/IndoorAmbianceView.vue";
import ExempleDashboardView from "@/views/ExempleDashboardView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "dashboard",
            component: DashboardView,
        },
        {
            path: "/oauth2/callback",
            name: "oauth2.callback",
            component: OAuth2CallbackView,
        },
        {
            path: "/responsibilities/lighting",
            name: "responsibilities.lighting",
            component: ResponsibilitiesLightingView,
        },
        {
            path: "/responsibilities/buildings",
            name: "responsibilities.buildings",
            component: ResponsibilitiesBuildingsView,
        },
        {
            path: "/water-level",
            name: "water-level",
            component: WaterLevelView,
        },
        {
            path: "/indoor-ambiance",
            name: "indoor-ambiance",
            component: IndoorAmbianceView,
        },
        {
            path: "/exemple-dashboard",
            name: "exemple-dashboard",
            component: ExempleDashboardView,
        },
        {
            path: "/unauthorized",
            name: "unauthorized",
            component: UnauthorizedView,
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
