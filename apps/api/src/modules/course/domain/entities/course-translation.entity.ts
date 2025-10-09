import { BaseTranslationEntity } from '@api/common/abstract/domain'; export class
CourseTranslation extends BaseTranslationEntity { constructor( id: string, locale:
string, public name: string, public description: string | null, createdAt: Date, updatedAt: Date, )
{ super(id, locale, createdAt, updatedAt); } updateName(name: string): void { this.name =
name.trim(); } updateDescription(description: string | null): void { this.description =
description?.trim() || null; } static create( id: string, locale: string, name: string,
description?: string, ):
CourseTranslation { const now = new Date(); return new
CourseTranslation( id, locale, name.trim(), description?.trim() || null, now, now, ); }
}