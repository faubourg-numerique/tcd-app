export interface Streetlight {
    id: string
    name: string
    powerState: string
    powerStateObservedAt: string
    hasZone: string
    coordinates: {
        long: number
        lat: number
    }
};
