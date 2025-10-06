import { BaseEntity } from '@api/common/abstract/domain';

export class Album extends BaseEntity {
    constructor(
        id: string,
        public artistId: string,
        public title: string,
        public releaseYear: number,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    static create(id: string, artistId: string, title: string, releaseYear: number): Album {
        const now = new Date();
        return new Album(id, artistId, title, releaseYear, now, now);
    }
}
