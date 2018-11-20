export interface Trades{
    id?:string;
    bought_from:string;
    bought_by:string;
    category_id: string;
    user_id: string;
    imgUrl: string;
    name: string;
    brief_description: string;
    description: string;
    units: number;
    measurement?: string;
    price: number;
    lat?: number;
    lng?:number;
    location?: string;
}