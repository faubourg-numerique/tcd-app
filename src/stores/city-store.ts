import { defineStore } from "pinia";
import { reactive } from "vue";

import CityNotFoundError from "@/errors/NotFoundError/CityNotFoundError";
import type { City } from "@/models/City";
import { useMainStore } from "@/stores/main-store";

export const useCityStore = defineStore("city", () => {
    const mainStore = useMainStore();

    const cities: City[] = reactive([]);

    function getCity(cityId: string) {
        const city = cities.find((city) => city.id === cityId);
        if (!city) {
            throw new CityNotFoundError(cityId);
        }
        return city;
    }

    async function fetchCities() {
        cities.length = 0;
        const response = await mainStore.api.get("/cities");
        cities.push(...response.data);
    }

    function $reset() {
        cities.length = 0;
    }

    return { cities, getCity, fetchCities, $reset };
});
