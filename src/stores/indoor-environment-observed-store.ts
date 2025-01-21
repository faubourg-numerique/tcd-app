import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import IndoorEnvironmentObservedNotFoundError from "@/errors/NotFoundError/IndoorEnvironmentObservedNotFoundError";

import type { IndoorEnvironmentObserved } from "@/types/IndoorEnvironmentObserved";

export const useIndoorEnvironmentObservedStore = defineStore("indoor-environment-observed", () => {
    const indoorEnvironmentObserveds: IndoorEnvironmentObserved[] = reactive([]);

    function getIndoorEnvironmentObserved(indoorEnvironmentObservedId: string) {
        const indoorEnvironmentObserved = indoorEnvironmentObserveds.find((indoorEnvironmentObserved) => indoorEnvironmentObserved.id === indoorEnvironmentObservedId);
        if (!indoorEnvironmentObserved) {
            throw new IndoorEnvironmentObservedNotFoundError(indoorEnvironmentObservedId);
        }
        return indoorEnvironmentObserved;
    }

    function getIndoorEnvironmentObservedsByRoomId(roomId: string) {
        return indoorEnvironmentObserveds.filter((indoorEnvironmentObserved) => indoorEnvironmentObserved.hasRoom === roomId);
    }

    async function fetchIndoorEnvironmentObserveds() {
        $reset();
        const response = await api.get("/indoor-environment-observeds");
        indoorEnvironmentObserveds.push(...response.data);
    }

    function $reset() {
        indoorEnvironmentObserveds.length = 0;
    }

    return { indoorEnvironmentObserveds, getIndoorEnvironmentObserved, getIndoorEnvironmentObservedsByRoomId, fetchIndoorEnvironmentObserveds, $reset };
});
