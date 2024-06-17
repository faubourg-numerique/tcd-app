export interface Streetlight {
  id: string
  type: string
  name: string
  powerState: string
  powerStateObservedAt: string
  hasZone: string
  coordinates: {
    long: number
    lat: number
  }
}
