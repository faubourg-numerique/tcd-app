import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";

export const useDemoStore = defineStore("demo", () => {
    const floodMonitoringCurrentLevel: { [floodMonitoringId: string]: number } = reactive({});
    const streetlightPowerState: { [streetlightId: string]: string } = reactive({});
    const wasteContainerFillingLevel: { [wasteContainerId: string]: number } = reactive({});
    const thermostatTargetTemperature: { [thermostatId: string]: number } = reactive({});

    const floodMonitoringCurrentLevelHistory: { id: string, value: number, date: Date }[] = reactive([]);
    const streetlightPowerStateHistory: { id: string, value: string, date: Date }[] = reactive([]);
    const wasteContainerFillingLevelHistory: { id: string, value: number, date: Date }[] = reactive([]);
    const thermostatTargetTemperatureHistory: { id: string, value: number, date: Date }[] = reactive([]);

    const lastMessageTime: Ref<number> = ref(0);

    function setFloodMonitoringCurrentLevel(floodMonitoringId: string, currentLevel: number) {
        floodMonitoringCurrentLevel[floodMonitoringId] = currentLevel;
        floodMonitoringCurrentLevelHistory.push({
            id: floodMonitoringId,
            value: currentLevel,
            date: new Date()
        });
        lastMessageTime.value = Date.now();
    }

    function setStreetlightPowerState(streetlightId: string, powerState: string) {
        streetlightPowerState[streetlightId] = powerState;
        streetlightPowerStateHistory.push({
            id: streetlightId,
            value: powerState,
            date: new Date()
        });
        lastMessageTime.value = Date.now();
    }

    function setWasteContainerFillingLevel(wasteContainerId: string, fillingLevel: number) {
        wasteContainerFillingLevel[wasteContainerId] = fillingLevel;
        wasteContainerFillingLevelHistory.push({
            id: wasteContainerId,
            value: fillingLevel,
            date: new Date()
        });
        lastMessageTime.value = Date.now();
    }

    function setThermostatTargetTemperature(thermostatId: string, targetTemperature: number) {
        thermostatTargetTemperature[thermostatId] = targetTemperature;
        thermostatTargetTemperatureHistory.push({
            id: thermostatId,
            value: targetTemperature,
            date: new Date()
        });
        lastMessageTime.value = Date.now();
    }

    function $reset() {
        for (const name of Object.getOwnPropertyNames(floodMonitoringCurrentLevel)) {
            delete floodMonitoringCurrentLevel[name];
        }
        for (const name of Object.getOwnPropertyNames(streetlightPowerState)) {
            delete streetlightPowerState[name];
        }
        for (const name of Object.getOwnPropertyNames(wasteContainerFillingLevel)) {
            delete wasteContainerFillingLevel[name];
        }
        for (const name of Object.getOwnPropertyNames(thermostatTargetTemperature)) {
            delete thermostatTargetTemperature[name];
        }

        floodMonitoringCurrentLevelHistory.length = 0;
        streetlightPowerStateHistory.length = 0;
        wasteContainerFillingLevelHistory.length = 0;
        thermostatTargetTemperatureHistory.length = 0;

        lastMessageTime.value = 0;
    }

    return { floodMonitoringCurrentLevel, streetlightPowerState, wasteContainerFillingLevel, thermostatTargetTemperature, floodMonitoringCurrentLevelHistory, streetlightPowerStateHistory, wasteContainerFillingLevelHistory, thermostatTargetTemperatureHistory, lastMessageTime, setFloodMonitoringCurrentLevel, setStreetlightPowerState, setWasteContainerFillingLevel, setThermostatTargetTemperature, $reset };
});
