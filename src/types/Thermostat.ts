type Thermostat = {
    id: string;
    location: [number, number];
    name: string;
    temperature: number;
    wotServerUrl: string;
    hasDeviceCommand: string;
    hasDeviceMeasurement: string;
    hasZone: string;
};

export default Thermostat;
