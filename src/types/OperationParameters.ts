type OperationParameters = {
    id: string;
    name: string;
    parameters?: { [key: string]: string | number };
    hasOperation: string;
};

export default OperationParameters;
