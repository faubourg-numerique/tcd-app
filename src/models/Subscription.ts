import type { Measurement } from './Measurement'; 


export interface Notification {
    attributes: string[];
    format: string;
    endpoint: Endpoint;
    status: string;
    timesSent?: number;
    lastNotification?: string;
    lastSuccess?: string;
}

export interface Endpoint {
    uri: string;
    accept: string;
}

export interface Subscription {
    id: string;
    type: string;
    subscriptionName: string;
    entities: Measurement[];
    watchedAttributes?: string[];
    q?: string;
    status: string;
    isActive: boolean;
    notification: Notification;
    throttling?: number;
    origin: string;
    jsonldContext: string;
}

