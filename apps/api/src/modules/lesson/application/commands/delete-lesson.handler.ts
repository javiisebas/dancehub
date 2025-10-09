import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    ILessonRepository,
    LESSON_REPOSITORY,
} from '../../domain/repositories/i-lesson.repository';

export class DeleteLessonCommand extends DeleteCommand {}

@Injectable()
export class DeleteLessonHandler {
    constructor(
        @Inject(LESSON_REPOSITORY) private readonly repository: ILessonRepository,
    ) {}

    async execute({ id }: DeleteLessonCommand): Promise<void> {
        await this.repository.delete(id);
    }
}