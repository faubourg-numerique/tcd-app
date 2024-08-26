export interface AlertSetting {
    id: string; 
    name: {
      type: string;
      value: string;
    };
    criteriaType: {
      type: string;
      value: string; 
    };
    hasSubscription: {
      type: string;
      value: string; 
    };
    hasEntity: {
      type: string;
      object: string; 
    };
  }
  