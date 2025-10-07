import { BaseEntity } from '@api/common/abstract/domain';

export class Song extends BaseEntity {
    constructor(
        id: string,
        public albumId: string,
        public artistId: string,
        public title: string,
        public duration: number,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    static create(
        id: string,
        albumId: string,
        artistId: string,
        title: string,
        duration: number,
    ): Song {
        const now = new Date();
        return new Song(id, albumId, artistId, title, duration, now, now);
    }

    updateTitle(title: string): void {
        this.title = title;
        this.updatedAt = new Date();
    }

    updateDuration(duration: number): void {
        this.duration = duration;
        this.updatedAt = new Date();
    }
}
