import type { Measurement } from './Measurement'; 

export interface Subscription {
    id: string;
    type: string;
    subscriptionName: string;
    entities: Measurement[];
    watchedAttributes: string[];
    status: string;
    isActive: boolean;
    notification: Notification;
    origin: string;
    jsonldContext: string;
}



