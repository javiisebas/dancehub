import { BaseEntity } from '@api/common/abstract/domain';

export class Song extends BaseEntity {
    constructor(
        id: string,
        public albumId: string,
        public title: string,
        public duration: number,
        public trackNumber: number,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    static create(
        id: string,
        albumId: string,
        title: string,
        duration: number,
        trackNumber: number,
    ): Song {
        const now = new Date();
        return new Song(id, albumId, title, duration, trackNumber, now, now);
    }
}
