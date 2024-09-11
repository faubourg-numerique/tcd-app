import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import WasteContainerNotFoundError from "@/errors/NotFoundError/WasteContainerNotFoundError";

import type WasteContainer from "@/types/WasteContainer";

export const useWasteContainerStore = defineStore("waste-container", () => {
    const wasteContainers: WasteContainer[] = reactive([]);

    function getWasteContainer(wasteContainerId: string) {
        const wasteContainer = wasteContainers.find((wasteContainer) => wasteContainer.id === wasteContainerId);
        if (!wasteContainer) {
            throw new WasteContainerNotFoundError(wasteContainerId);
        }
        return wasteContainer;
    }

    function getWasteContainersByZoneId(zoneId: string) {
        return wasteContainers.filter((wasteContainer) => wasteContainer.hasZone === zoneId);
    }

    async function fetchWasteContainers() {
        $reset();
        const response = await api.get("/waste-containers");
        wasteContainers.push(...response.data);
    }

    function $reset() {
        wasteContainers.length = 0;
    }

    return { wasteContainers, getWasteContainer, getWasteContainersByZoneId, fetchWasteContainers, $reset };
});
