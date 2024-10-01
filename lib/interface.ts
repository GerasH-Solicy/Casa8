export interface Apartment {
    _id: string;
    title: string;
    description: string;
    address: string;
    city: string;
    monthlyRent: number;
    propertyType: "Apartment" | "House" | "Loft" | "Studio" | "Townhouse";
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    createdAt?: Date;
    userEmail: string;
    images?: string[];
    available?: Date;
    amenities?: string[];
    liked?: boolean
}
