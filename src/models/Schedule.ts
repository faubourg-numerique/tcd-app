export default interface Schedule {
    id: string;
    name: string;
    byDay: Array<number> | null;
    startTime: string;
    startDate: string;
    endTime: string;
    endDate: string;
}
