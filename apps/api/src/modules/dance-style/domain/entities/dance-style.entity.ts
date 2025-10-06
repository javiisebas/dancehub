import { BaseTranslatableEntity } from '@api/common/abstract/domain';
import { DanceStyleTranslation } from './dance-style-translation.entity';

export class DanceStyle extends BaseTranslatableEntity<DanceStyleTranslation> {
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
