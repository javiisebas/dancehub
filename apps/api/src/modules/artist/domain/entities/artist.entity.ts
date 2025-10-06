import { BaseEntity } from '@api/common/abstract/domain';

export class Artist extends BaseEntity {
    constructor(
        id: string,
        public name: string,
        public country: string,
        public bio: string | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    static create(id: string, name: string, country: string, bio?: string): Artist {
        const now = new Date();
        return new Artist(id, name, country, bio || null, now, now);
    }
}
