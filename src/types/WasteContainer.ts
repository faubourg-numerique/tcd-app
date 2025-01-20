export type WasteContainer = {
    id: string;
    fillingLevel: number;
    location: [number, number];
    name: string;
    storedWasteKind: string;
    hasDeviceMeasurement: string;
    hasZone: string;
};
