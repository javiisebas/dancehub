import { BaseEntity } from '@api/common/abstract/domain';

export class Venue extends BaseEntity {
    constructor(
        id: string,
        public name: string,
        public slug: string,
        public address: string,
        public city: string,
        public country: string,
        public capacity: number | null,
        public hasParking: boolean,
        public ownerId: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    updateBasicInfo(name: string, address: string, city: string, country: string): void {
        this.name = name;
        this.address = address;
        this.city = city;
        this.country = country;
    }

    updateCapacity(capacity: number | null): void {
        this.capacity = capacity;
    }

    setParking(hasParking: boolean): void {
        this.hasParking = hasParking;
    }

    static create(
        id: string,
        name: string,
        slug: string,
        address: string,
        city: string,
        country: string,
        ownerId: string,
        capacity: number | null = null,
        hasParking: boolean = false,
    ): Venue {
        const now = new Date();
        return new Venue(
            id,
            name,
            slug,
            address,
            city,
            country,
            capacity,
            hasParking,
            ownerId,
            now,
            now,
        );
    }
}

