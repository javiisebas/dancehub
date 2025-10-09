import { BaseTranslatableEntity } from '@api/common/abstract/domain';
import { CourseLevelEnum } from '@repo/shared';
import { CourseTranslation } from './course-translation.entity';

export class Course extends BaseTranslatableEntity<CourseTranslation> {
    constructor(
        id: string,
        public slug: string,
        public level: CourseLevelEnum,
        public duration: number,
        public price: number,
        public instructorId: string,
        public danceStyleId: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    updateSlug(slug: string): void {
        this.slug = slug.toLowerCase().trim();
    }

    updateLevel(level: CourseLevelEnum): void {
        this.level = level;
    }

    updateDuration(duration: number): void {
        this.duration = duration;
    }

    updatePrice(price: number): void {
        this.price = price;
    }

    static create(
        id: string,
        slug: string,
        level: CourseLevelEnum,
        duration: number,
        price: number,
        instructorId: string,
        danceStyleId: string,
    ): Course {
        const now = new Date();
        return new Course(
            id,
            slug.toLowerCase().trim(),
            level,
            duration,
            price,
            instructorId,
            danceStyleId,
            now,
            now,
        );
    }
}
