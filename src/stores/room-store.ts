import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import RoomNotFoundError from "@/errors/NotFoundError/RoomNotFoundError";

import type { Room } from "@/types/Room";

export const useRoomStore = defineStore("room", () => {
    const rooms: Room[] = reactive([]);

    function getRoom(roomId: string) {
        const room = rooms.find((room) => room.id === roomId);
        if (!room) {
            throw new RoomNotFoundError(roomId);
        }
        return room;
    }

    function getRoomsByBuildingId(buildingId: string) {
        return rooms.filter((room) => room.hasBuilding === buildingId);
    }

    async function fetchRooms() {
        $reset();
        const response = await api.get("/rooms");
        rooms.push(...response.data);
    }

    function $reset() {
        rooms.length = 0;
    }

    return { rooms, getRoom, getRoomsByBuildingId, fetchRooms, $reset };
});
