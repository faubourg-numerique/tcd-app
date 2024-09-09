export interface Thermostat {
    id: string;
    hasZone: string;
    location: number[];
    name: string;
    temperature: number;
    temperatureObservedAt: string;
    temperatureObservedBy: string;
}
