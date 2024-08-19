export interface Measurement {
    id: string;
    measurementType: {
      value: string;
    };
    name: {
      value: string;
    };
    distance?: {
      value: number;
      unit?: {
        value: string;
      };
    };
    maxAlerte?: {
      value: string;
    };
    enAlerte?: {
      value: string;
    };
    temporisation?: {
      value: string;
    };
}
