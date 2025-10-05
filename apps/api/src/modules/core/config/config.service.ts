import { AllConfigType } from '@api/common/config/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypedConfigService extends ConfigService<AllConfigType> {
    get<K extends Extract<keyof AllConfigType, string>>(key: K): AllConfigType[K] | undefined;
    get<
        K extends Extract<keyof AllConfigType, string>,
        P extends Extract<keyof AllConfigType[K], string>,
    >(key: `${K}.${P}`): AllConfigType[K][P] | undefined;
    get<K extends Extract<keyof AllConfigType, string>>(
        key: K,
        defaultValue: NonNullable<AllConfigType[K]>,
    ): NonNullable<AllConfigType[K]>;
    get<
        K extends Extract<keyof AllConfigType, string>,
        P extends Extract<keyof AllConfigType[K], string>,
    >(
        key: `${K}.${P}`,
        defaultValue: NonNullable<AllConfigType[K][P]>,
    ): NonNullable<AllConfigType[K][P]>;
    get(key: any, defaultValue?: any): any {
        const value = super.get(key, { infer: true });
        return value !== undefined ? value : defaultValue;
    }
}
