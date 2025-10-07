import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    DANCE_STYLE_REPOSITORY,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class DeleteDanceStyleCommand extends DeleteCommand {}

@Injectable()
export class DeleteDanceStyleHandler {
    constructor(
        @Inject(DANCE_STYLE_REPOSITORY) private readonly repository: IDanceStyleRepository,
    ) {}

    async execute({ id }: DeleteDanceStyleCommand): Promise<void> {
        return this.repository.delete(id);
    }
}
