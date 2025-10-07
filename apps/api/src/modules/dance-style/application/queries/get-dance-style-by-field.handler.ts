import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import {
    DANCE_STYLE_REPOSITORY,
    DanceStyleField,
    DanceStyleRelations,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class GetDanceStyleByFieldQuery extends GetByFieldQuery<
    DanceStyleField,
    DanceStyleRelations
> {}

@Injectable()
export class GetDanceStyleByFieldHandler extends BaseGetByFieldHandler<
    DanceStyle,
    DanceStyleField,
    DanceStyleRelations
> {
    constructor(@Inject(DANCE_STYLE_REPOSITORY) repository: IDanceStyleRepository) {
        super(repository);
    }
}
