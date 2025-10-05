import { Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { LogicalOperator } from '../../../enums/filter-operator.enum';
import { FilterCondition } from './filter-condition.request';

export class FilterGroup<TField extends string = string> {
    @Expose()
    @IsEnum(LogicalOperator)
    operator!: LogicalOperator;

    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    conditions!: Array<FilterCondition<TField> | FilterGroup<TField>>;
}

export type Filter<TField extends string = string> = FilterCondition<TField> | FilterGroup<TField>;
