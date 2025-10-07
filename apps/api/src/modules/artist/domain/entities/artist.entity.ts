import { BaseEntity } from '@api/common/abstract/domain';

export class Artist extends BaseEntity {
    constructor(
        id: string,
        public name: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    static create(id: string, name: string): Artist {
        const now = new Date();
        return new Artist(id, name, now, now);
    }

    updateName(name: string): void {
        this.name = name;
        this.updatedAt = new Date();
    }
}
