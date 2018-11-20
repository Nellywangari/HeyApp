export interface Chat {
    message: string;
    pair: string;
    sender: string;
    time: number;
    notification?:boolean;
    notificationmessage?:string;
}