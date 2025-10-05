import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FilterOperator } from '../../../enums/filter-operator.enum';

export class FilterCondition<TField extends string = string> {
    @Expose()
    @IsString()
    field!: TField;

    @Expose()
    @IsEnum(FilterOperator)
    operator!: FilterOperator;

    @Expose()
    @IsOptional()
    value?: string | number | boolean | Date | string[] | number[] | boolean[] | Date[] | null;
}
