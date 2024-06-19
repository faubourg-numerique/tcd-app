export interface Zone {
    id: string
    name: string
    hasCity: string
    coordinates: [
        {
            long: number
            lat: number
        }
    ]
};
