type OperationSchedule = {
    id: string;
    byDay: number[];
    duration: string;
    endDate: string;
    endTime: string;
    name: string;
    startDate: string;
    startTime: string;
    hasOperation: string;
    hasOperationParameters: string;
    hasZone: string;
};

export default OperationSchedule;
