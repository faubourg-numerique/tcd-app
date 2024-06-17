export interface Thermostat {
  id: string
  name: string
  temperature: {
    value: number
    observedAt: string
    observedBy: string
  }
  hasZone: string
}
