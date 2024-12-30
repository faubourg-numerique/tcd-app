import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import BuildingNotFoundError from "@/errors/NotFoundError/BuildingNotFoundError";

import type { Building } from "@/types/Building";

export const useBuildingStore = defineStore("building", () => {
    const buildings: Building[] = reactive([]);

    function getBuilding(buildingId: string) {
        const building = buildings.find((building) => building.id === buildingId);
        if (!building) {
            throw new BuildingNotFoundError(buildingId);
        }
        return building;
    }

    function getBuildingsByZoneId(zoneId: string) {
        return buildings.filter((building) => building.hasZone === zoneId);
    }

    async function fetchBuildings() {
        $reset();
        const response = await api.get("/buildings");
        buildings.push(...response.data);
    }

    function $reset() {
        buildings.length = 0;
    }

    return { buildings, getBuilding, getBuildingsByZoneId, fetchBuildings, $reset };
});
