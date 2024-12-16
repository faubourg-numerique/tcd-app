import { useDemoStore } from "@/stores/demo-store";

const demoWebSocketClient = new WebSocket("wss://dev.api.tcd.drural.fr:9092");

demoWebSocketClient.addEventListener("message", (event) => {
    const demoStore = useDemoStore();

    const message = JSON.parse(event.data);

    switch(message.type) {
        case "flood-monitoring-current-level": {
            demoStore.setFloodMonitoringCurrentLevel(message.floodMonitoringId, message.currentLevel);
            break;
        }
        case "streetlight-power-state": {
            demoStore.setStreetlightPowerState(message.streetlightId, message.powerState);
            break;
        }
        case "waste-container-filling-level": {
            demoStore.setWasteContainerFillingLevel(message.wasteContainerId, message.fillingLevel);
            break;
        }
        case "thermostat-target-temperature": {
            demoStore.setThermostatTargetTemperature(message.thermostatId, message.targetTemperature);
            break;
        }
    }
});

export { demoWebSocketClient };
