export type DeviceMeasurementRow = {
    id: string | null;
    dateTime: string | null;
    batteryVoltage: number | null;
    brokenSensor: boolean | null;
    childLock: boolean | null;
    co2: number | null;
    distance: number | null;
    highMotorConsumption: boolean | null;
    humidity: number | null;
    light: number | null;
    lowMotorConsumption: boolean | null;
    measurementType: string | null;
    motion: number | null;
    motorPosition: number | null;
    motorRange: number | null;
    name: string | null;
    openWindow: boolean | null;
    pressure: number | null;
    reason: number | null;
    refDevice: string | null;
    relativeHumidity: number | null;
    sensorTemperature: number | null;
    targetTemperature: number | null;
    temperature: number | null;
    vdd: number | null;
    fillingLevel: number | null;
    currentLevel: number | null;
};
