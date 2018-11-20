export interface Notification{
    id?:string;
    message?: string;
    pair?: string;
    sender?: string;
    time: number;
    notification:boolean;
    notificationmessage:string;
}