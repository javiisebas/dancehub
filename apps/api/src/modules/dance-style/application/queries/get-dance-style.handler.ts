import { BaseGetTranslatableHandler } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { DanceStyleTranslation } from '../../domain/entities/dance-style-translation.entity';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import {
    DANCE_STYLE_REPOSITORY,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class GetDanceStyleQuery {
    constructor(
        public readonly id: string,
        public readonly locale?: string,
    ) {}
}

@Injectable()
export class GetDanceStyleHandler extends BaseGetTranslatableHandler<
    DanceStyle,
    DanceStyleTranslation
> {
    constructor(@Inject(DANCE_STYLE_REPOSITORY) repository: IDanceStyleRepository) {
        super(repository);
    }

    async executeQuery({ id, locale }: GetDanceStyleQuery) {
        return this.execute(id, locale);
    }
}
