import { InferFields } from '@api/modules/core/database/base';
import { IBaseTranslatableRepository } from '@api/modules/core/database/interfaces/i-base-translatable.repository';
import { danceStyles } from '../../infrastructure/schemas/dance-style.schema';
import { DanceStyleTranslation } from '../entities/dance-style-translation.entity';
import { DanceStyle } from '../entities/dance-style.entity';

export const DANCE_STYLE_REPOSITORY = Symbol('DANCE_STYLE_REPOSITORY');

export type DanceStyleField = InferFields<typeof danceStyles>;
export type DanceStyleRelations = {};

export interface IDanceStyleRepository
    extends IBaseTranslatableRepository<DanceStyle, DanceStyleTranslation, DanceStyleField> {
    findBySlug(slug: string): Promise<DanceStyle | null>;
    slugExists(slug: string): Promise<boolean>;
}
