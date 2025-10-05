import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateDanceStyleRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { DanceStyleTranslation } from '../../domain/entities/dance-style-translation.entity';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import {
    DANCE_STYLE_REPOSITORY,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class CreateDanceStyleCommand extends CreateCommand<CreateDanceStyleRequest> {}

@Injectable()
export class CreateDanceStyleHandler {
    constructor(
        @Inject(DANCE_STYLE_REPOSITORY) private readonly repository: IDanceStyleRepository,
    ) {}

    async execute({ data }: CreateDanceStyleCommand) {
        const slugExists = await this.repository.slugExists(data.slug);
        if (slugExists) {
            throw new ConflictException('Slug already exists');
        }

        const danceStyle = DanceStyle.create(randomUUID(), data.slug);
        const savedDanceStyle = await this.repository.save(danceStyle);

        const translations = data.translations.map((t) =>
            DanceStyleTranslation.create(randomUUID(), t.locale, t.name, t.description),
        );

        await this.repository.saveTranslations(savedDanceStyle.id, translations);

        return this.repository.findByIdWithTranslations(savedDanceStyle.id);
    }
}
