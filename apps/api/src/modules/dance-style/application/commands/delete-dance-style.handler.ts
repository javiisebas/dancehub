import { BaseDeleteTranslatableHandler } from '@api/common/abstract/application';
import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { DanceStyleTranslation } from '../../domain/entities/dance-style-translation.entity';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import {
    DANCE_STYLE_REPOSITORY,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class DeleteDanceStyleCommand extends DeleteCommand {}

@Injectable()
export class DeleteDanceStyleHandler extends BaseDeleteTranslatableHandler<
    DanceStyle,
    DanceStyleTranslation
> {
    constructor(@Inject(DANCE_STYLE_REPOSITORY) repository: IDanceStyleRepository) {
        super(repository);
    }

    async executeCommand({ id }: DeleteDanceStyleCommand): Promise<void> {
        return this.execute(id);
    }
}
