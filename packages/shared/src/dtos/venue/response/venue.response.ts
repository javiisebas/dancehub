export class VenueResponse {
    id: string;
    name: string;
    slug: string;
    address: string;
    city: string;
    country: string;
    capacity: number | null;
    hasParking: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;

    owner?: {
        id: string;
        email: string;
        name: string;
        displayName: string | null;
    };

    danceStyles?: Array<{
        id: string;
        slug: string;
    }>;
}
