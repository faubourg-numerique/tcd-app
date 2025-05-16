export type Streetlight = {
    id: string;
    location: [number, number];
    name: string;
    powerState: string;
    wotServerUrl: string;
    hasZone: string;
    refStreetlightControlCabinet: string;
    currentPowerConsumption : number;
};
