export type Thermostat = {
    id: string;
    location: [number, number];
    name: string;
    temperature: number;
    wotServerUrl: string;
    hasDeviceCommand: string;
    hasDeviceMeasurement: string;
    hasRoom: string;
};
