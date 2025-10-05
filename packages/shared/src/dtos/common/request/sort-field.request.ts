import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortNullsPosition, SortOrder } from '../../../enums/filter-operator.enum';

export class SortField<TField extends string = string> {
    @Expose()
    @IsString()
    field!: TField;

    @Expose()
    @IsEnum(SortOrder)
    order!: SortOrder;

    @Expose()
    @IsOptional()
    @IsEnum(SortNullsPosition)
    nulls?: SortNullsPosition;
}

export type Sort<TField extends string = string> = SortField<TField> | SortField<TField>[];
