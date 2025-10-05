import {
    BaseGetPaginatedTranslatableHandler,
    GetPaginatedQuery,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedDanceStyleRequest } from '@repo/shared';
import { DanceStyleTranslation } from '../../domain/entities/dance-style-translation.entity';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import {
    DANCE_STYLE_REPOSITORY,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class GetPaginatedDanceStylesQuery extends GetPaginatedQuery<PaginatedDanceStyleRequest> {}

@Injectable()
export class GetPaginatedDanceStylesHandler extends BaseGetPaginatedTranslatableHandler<
    DanceStyle,
    DanceStyleTranslation
> {
    constructor(@Inject(DANCE_STYLE_REPOSITORY) repository: IDanceStyleRepository) {
        super(repository);
    }

    async executeQuery({ data }: GetPaginatedDanceStylesQuery) {
        return this.execute(data);
    }
}
