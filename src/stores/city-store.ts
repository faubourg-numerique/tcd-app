import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import CityNotFoundError from "@/errors/NotFoundError/CityNotFoundError";

import type { City } from "@/types/City";

export const useCityStore = defineStore("city", () => {
    const cities: City[] = reactive([]);

    function getCity(cityId: string) {
        const city = cities.find((city) => city.id === cityId);
        if (!city) {
            throw new CityNotFoundError(cityId);
        }
        return city;
    }

    async function fetchCities() {
        $reset();
        const response = await api.get("/cities");
        cities.push(...response.data);
    }

    function $reset() {
        cities.length = 0;
    }

    return { cities, getCity, fetchCities, $reset };
});
