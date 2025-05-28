export interface Student {
    firstName: string;
    lastName: string;
    avatar: string;
    present: boolean;
    id?: number;
    timestamp?: string;
    location?: {
        lat: number;
        lng: number;
    };
    // URL
    photo?: string;
}