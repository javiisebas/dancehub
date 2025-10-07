import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedDanceStyleRequest } from '@repo/shared';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import {
    DANCE_STYLE_REPOSITORY,
    DanceStyleField,
    DanceStyleRelations,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class GetPaginatedDanceStylesQuery extends GetPaginatedQueryEnhanced<PaginatedDanceStyleRequest> {}

@Injectable()
export class GetPaginatedDanceStylesHandler extends BaseGetPaginatedHandler<
    DanceStyle,
    PaginatedDanceStyleRequest,
    DanceStyleField,
    DanceStyleRelations
> {
    constructor(@Inject(DANCE_STYLE_REPOSITORY) repository: IDanceStyleRepository) {
        super(repository);
    }
}
