import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateLessonRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { Lesson } from '../../domain/entities/lesson.entity';
import {
    ILessonRepository,
    LESSON_REPOSITORY,
} from '../../domain/repositories/i-lesson.repository';

export class CreateLessonCommand extends CreateCommand<CreateLessonRequest> {}

@Injectable()
export class CreateLessonHandler {
    constructor(
        @Inject(LESSON_REPOSITORY) private readonly repository: ILessonRepository,
    ) {}

    async execute({ data }: CreateLessonCommand) {
        const lesson = Lesson.create({
            id: randomUUID(),
            name: data.name,
            description: data.description,
            content: data.content,
            videoUrl: data.videoUrl,
            duration: data.duration,
            order: data.order,
            moduleId: data.moduleId,
        });

        return this.repository.save(lesson);
    }
}