import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import {
    DANCE_STYLE_REPOSITORY,
    DanceStyleField,
    DanceStyleRelations,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class FindManyDanceStylesQuery extends FindManyQuery<DanceStyleField, DanceStyleRelations> {}

@Injectable()
export class FindManyDanceStylesHandler extends BaseFindManyHandler<
    DanceStyle,
    DanceStyleField,
    DanceStyleRelations
> {
    constructor(@Inject(DANCE_STYLE_REPOSITORY) repository: IDanceStyleRepository) {
        super(repository);
    }
}
