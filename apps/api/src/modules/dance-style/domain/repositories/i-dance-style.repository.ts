import { IBaseTranslatableRepository } from '@api/modules/core/database/base/base-translatable.repository.interface';
import { DanceStyleField } from '@repo/shared';
import { DanceStyleTranslation } from '../entities/dance-style-translation.entity';
import { DanceStyle } from '../entities/dance-style.entity';

export const DANCE_STYLE_REPOSITORY = Symbol('DANCE_STYLE_REPOSITORY');

export interface IDanceStyleRepository
    extends IBaseTranslatableRepository<DanceStyle, DanceStyleTranslation, DanceStyleField> {
    findBySlug(slug: string): Promise<DanceStyle | null>;
    slugExists(slug: string): Promise<boolean>;
}
