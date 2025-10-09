import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { CourseModule } from '../../domain/entities/course-module.entity';
import { ICourseModuleRepository } from '../../domain/repositories/i-course-module.repository';
import { courseModules } from '../schemas/course-module.schema';

@Injectable()
export class CourseModuleRepositoryImpl
    extends BaseRepository<CourseModule, typeof courseModules>
    implements ICourseModuleRepository
{
    protected readonly table = courseModules;
    protected readonly entityName = 'CourseModule';

    protected toDomain(schema: typeof courseModules.$inferSelect): CourseModule {
        return CourseModule.fromPersistence({
            id: schema.id,
            name: schema.name,
            description: schema.description,
            order: schema.order,
            courseId: schema.courseId,
            createdAt: schema.createdAt,
            updatedAt: schema.updatedAt,
        });
    }

    protected toSchema(entity: CourseModule): any {
        return {
            name: entity.name,
            ...(entity.description !== undefined && { description: entity.description }),
            order: entity.order,
            courseId: entity.courseId,
        };
    }
}
