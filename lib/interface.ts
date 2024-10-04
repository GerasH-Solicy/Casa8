import { PostStatus, PropertyType } from "./enum";

export interface Apartment {
    _id: string;
    title: string;
    description: string;
    address: string;
    city: string;
    monthlyRent: number;
    propertyType: PropertyType;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    createdAt?: Date;
    userEmail: string;
    images?: string[];
    available?: Date;
    amenities?: string[];
    phoneNumber?: string
    liked?: boolean
    status: PostStatus
    landlord?: any
}
