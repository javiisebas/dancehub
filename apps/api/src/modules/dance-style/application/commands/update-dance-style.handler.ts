import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UpdateDanceStyleRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { DanceStyleTranslation } from '../../domain/entities/dance-style-translation.entity';
import {
    DANCE_STYLE_REPOSITORY,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class UpdateDanceStyleCommand extends UpdateCommand<UpdateDanceStyleRequest> {}

@Injectable()
export class UpdateDanceStyleHandler {
    constructor(
        @Inject(DANCE_STYLE_REPOSITORY) private readonly repository: IDanceStyleRepository,
    ) {}

    async execute({ id, data }: UpdateDanceStyleCommand) {
        const danceStyle = await this.repository.findById(id);

        if (data.slug) {
            if (data.slug !== danceStyle.slug) {
                const slugExists = await this.repository.slugExists(data.slug);
                if (slugExists) {
                    throw new ConflictException('Slug already exists');
                }
            }
            danceStyle.updateSlug(data.slug);
            await this.repository.updateEntity(danceStyle);
        }

        if (data.translations) {
            await this.repository.upsertTranslations(
                id,
                data.translations.map((t) =>
                    DanceStyleTranslation.create(randomUUID(), t.locale, t.name, t.description),
                ),
            );
        }

        return this.repository.findByIdWithTranslations(id);
    }
}
