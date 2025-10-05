import { BaseTranslatableEntity } from '@api/common/abstract/domain';

export class DanceStyle extends BaseTranslatableEntity {
    constructor(
        id: string,
        public slug: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    updateSlug(slug: string): void {
        this.slug = slug.toLowerCase().trim();
    }

    static create(id: string, slug: string): DanceStyle {
        const now = new Date();
        return new DanceStyle(id, slug.toLowerCase().trim(), now, now);
    }
}
