import { defineStore } from "pinia";
import { reactive } from "vue";

import WasteContainerNotFoundError from "@/errors/NotFoundError/WasteContainerNotFoundError";
import type { WasteContainer } from "@/models/WasteContainer";
import { useMainStore } from "@/stores/main-store";

export const useWasteContainerStore = defineStore("waste-container", () => {
    const mainStore = useMainStore();

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
        wasteContainers.length = 0;
        const response = await mainStore.api.get("/waste-containers");
        wasteContainers.push(...response.data);
    }

    function $reset() {
        wasteContainers.length = 0;
    }

    return { wasteContainers, getWasteContainer, getWasteContainersByZoneId, fetchWasteContainers, $reset };
});
