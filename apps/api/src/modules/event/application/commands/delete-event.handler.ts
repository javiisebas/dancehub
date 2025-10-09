import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    IEventRepository,
    EVENT_REPOSITORY,
} from '../../domain/repositories/i-event.repository';

export class DeleteEventCommand extends DeleteCommand {}

@Injectable()
export class DeleteEventHandler {
    constructor(
        @Inject(EVENT_REPOSITORY) private readonly repository: IEventRepository,
    ) {}

    async execute({ id }: DeleteEventCommand): Promise<void> {
        await this.repository.delete(id);
    }
}