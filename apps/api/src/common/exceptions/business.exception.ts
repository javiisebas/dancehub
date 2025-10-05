import { Translations } from '@api/modules/core/i18n/translations/translations.type';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LocalesEnum } from '@repo/shared';
import { DotNestedLeafKeys } from '../interfaces/i18n/i-translation-key.interface';

export type ErrorKey = DotNestedLeafKeys<Translations['errors']>;

interface ProvidedErrorArgsMap {
    'common.invalidFilter': { field: string };
    'common.failedPagination': { error: string };
    'common.invalidOperator': { operator: string };
    'common.invalidConditionType': { type: string };
    'common.invalidSort': { field: string };
    'common.traductionAlreadyExists': { locale: string };
    'common.translationFieldRequired': { field: string | number | symbol; locale: LocalesEnum };
    'common.crudUnsupportedOperation': { operation: string };
    'common.resourceNotFound': { id: string };
    'database.uniqueConstraintViolation': { detail: string };
    'database.foreignKeyViolation': { detail: string };
    'database.checkConstraintViolation': { detail: string };
    'database.notNullViolation': { detail: string };
    'database.error': { detail: string };
    'qr.missingRequiredData': { field: string };
    'qr.generationFailed': { reason: string };
    'qr.verificationFailed': { reason: string };
    'common.unsupportedContextType': { type: string };
    'auth.invalidScopeSourceType': { type: string };
    'common.notFoundDetail': { detail: string };
    'common.alreadyExistsDetail': { detail: string };
    'cache.keyNotFound': { keyName: string | number | symbol; domain: string };
    'cache.invalidKeyFormat': { detail: string };
    'cache.operationFailed': { operation: string; detail: string };
    'common.requiredDetail': { detail: string };
    'common.invalidRequestDetail': { detail: string };
}

export type BusinessExceptionArgs<K extends ErrorKey> = K extends keyof ProvidedErrorArgsMap
    ? { code: K; args: ProvidedErrorArgsMap[K]; status?: HttpStatus }
    : { code: K; args?: never; status?: HttpStatus };

export class BusinessException<K extends ErrorKey> extends HttpException {
    constructor(public readonly data: BusinessExceptionArgs<K>) {
        super(data.code, data.status ?? HttpStatus.BAD_REQUEST);
    }
}
