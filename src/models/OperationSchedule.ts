export interface OperationSchedule {
    id: string;
    name: string;
    byDay: number[];
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    duration: string;
    hasZone: string;
}
