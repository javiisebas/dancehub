import {
    BaseTranslatableRepository,
    defineRelations,
    relation,
} from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { CourseLevelEnum, FilterOperator } from '@repo/shared';
import { PgColumn } from 'drizzle-orm/pg-core';
import { DanceStyle } from '../../../dance-style/domain/entities/dance-style.entity';
import { danceStyles } from '../../../dance-style/infrastructure/schemas/dance-style.schema';
import { User } from '../../../user/domain/entities/user.entity';
import { users } from '../../../user/infrastructure/schemas/user.schema';
import { CourseTranslation } from '../../domain/entities/course-translation.entity';
import { Course } from '../../domain/entities/course.entity';
import { ICourseRepository } from '../../domain/repositories/i-course.repository';
import { courses, courseTranslations } from '../schemas';

const courseRelations = defineRelations({
    instructor: relation.manyToOne({
        entity: User,
        table: users,
        foreignKey: 'instructorId',
    }),
    danceStyle: relation.manyToOne({
        entity: DanceStyle,
        table: danceStyles,
        foreignKey: 'danceStyleId',
    }),
});

@Injectable()
export class CourseRepositoryImpl
    extends BaseTranslatableRepository<
        Course,
        CourseTranslation,
        typeof courses,
        typeof courseTranslations,
        typeof courseRelations
    >
    implements ICourseRepository
{
    protected readonly table = courses;
    protected readonly translationTable = courseTranslations;
    protected readonly entityName = 'Course';
    protected readonly relations = courseRelations;

    protected toDomain(schema: typeof courses.$inferSelect): Course {
        return new Course(
            schema.id,
            schema.slug,
            schema.level as CourseLevelEnum,
            schema.duration,
            parseFloat(schema.price),
            schema.instructorId,
            schema.danceStyleId,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Course): any {
        return {
            slug: entity.slug,
            level: entity.level,
            duration: entity.duration,
            price: entity.price.toString(),
            instructorId: entity.instructorId,
            danceStyleId: entity.danceStyleId,
        };
    }

    protected translationToDomain(
        schema: typeof courseTranslations.$inferSelect,
    ): CourseTranslation {
        return new CourseTranslation(
            schema.id,
            schema.locale,
            schema.name,
            schema.description,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected translationToSchema(
        translation: CourseTranslation,
        entityId: string,
    ): Partial<typeof courseTranslations.$inferInsert> {
        return {
            courseId: entityId,
            locale: translation.locale,
            name: translation.name,
            description: translation.description || undefined,
        } as Partial<typeof courseTranslations.$inferInsert>;
    }

    protected getTranslationEntityIdColumn(): PgColumn {
        return courseTranslations.courseId;
    }

    async findBySlug(slug: string): Promise<Course | null> {
        return this.findOne({
            filter: {
                field: 'slug',
                operator: FilterOperator.EQ,
                value: slug,
            },
        });
    }

    async slugExists(slug: string): Promise<boolean> {
        return this.exists({
            field: 'slug',
            operator: FilterOperator.EQ,
            value: slug,
        });
    }
}
