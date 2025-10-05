import { SetMetadata } from '@nestjs/common';

export const INCLUDE_ALL_TRANSLATIONS_KEY = 'includeAllTranslations';

export const IncludeAllTranslations = () => SetMetadata(INCLUDE_ALL_TRANSLATIONS_KEY, true);
