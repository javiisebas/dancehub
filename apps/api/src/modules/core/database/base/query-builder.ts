import {
    Filter,
    FilterCondition,
    FilterGroup,
    FilterOperator,
    LogicalOperator,
    Sort,
    SortField,
    SortNullsPosition,
    SortOrder,
} from '@repo/shared';
import {
    and,
    asc,
    between,
    desc,
    eq,
    gt,
    gte,
    ilike,
    inArray,
    isNotNull,
    isNull,
    like,
    lt,
    lte,
    ne,
    notInArray,
    or,
    SQL,
    sql,
} from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { FieldMapper } from './field-mapper';

export class QueryBuilder<TTable extends PgTable, TField extends string = string> {
    private fieldMapper: FieldMapper<TTable, TField>;

    constructor(
        private readonly table: TTable,
        customFieldMapping?: Partial<Record<TField, keyof TTable>>,
    ) {
        if (!table) {
            throw new Error('QueryBuilder: table parameter is required');
        }
        this.fieldMapper = new FieldMapper(table, customFieldMapping);
    }

    buildWhereClause(filter?: Filter<TField>): SQL | undefined {
        if (!filter) return undefined;
        return this.processFilter(filter);
    }

    buildOrderByClause(sort?: Sort<TField>): SQL[] {
        if (!sort) return [];

        const sortFields = Array.isArray(sort) ? sort : [sort];
        return sortFields
            .map((field) => this.processSortField(field))
            .filter((s): s is SQL => s !== undefined);
    }

    private processFilter(filter: Filter<TField>): SQL | undefined {
        if (this.isFilterGroup(filter)) {
            return this.processFilterGroup(filter);
        }
        return this.processFilterCondition(filter);
    }

    private isFilterGroup(filter: Filter<TField>): filter is FilterGroup<TField> {
        return 'operator' in filter && 'conditions' in filter;
    }

    private processFilterGroup(group: FilterGroup<TField>): SQL | undefined {
        const processedConditions = group.conditions
            .map((condition) => this.processFilter(condition))
            .filter((c): c is SQL => c !== undefined);

        if (processedConditions.length === 0) return undefined;
        if (processedConditions.length === 1) return processedConditions[0];

        return group.operator === LogicalOperator.AND
            ? and(...processedConditions)
            : or(...processedConditions);
    }

    private processFilterCondition(condition: FilterCondition<TField>): SQL | undefined {
        const column = this.fieldMapper.getColumn(condition.field);
        if (!column) return undefined;

        return this.applyOperator(column, condition.operator, condition.value);
    }

    private applyOperator(
        column: PgColumn,
        operator: FilterOperator,
        value?: string | number | boolean | Date | null | Array<string | number | boolean | Date>,
    ): SQL | undefined {
        switch (operator) {
            case FilterOperator.EQ:
                return value !== undefined && value !== null && !Array.isArray(value)
                    ? eq(column, this.normalizeValue(value))
                    : undefined;
            case FilterOperator.NE:
                return value !== undefined && value !== null && !Array.isArray(value)
                    ? ne(column, this.normalizeValue(value))
                    : undefined;
            case FilterOperator.GT:
                return value !== undefined && value !== null && !Array.isArray(value)
                    ? gt(column, this.normalizeValue(value))
                    : undefined;
            case FilterOperator.GTE:
                return value !== undefined && value !== null && !Array.isArray(value)
                    ? gte(column, this.normalizeValue(value))
                    : undefined;
            case FilterOperator.LT:
                return value !== undefined && value !== null && !Array.isArray(value)
                    ? lt(column, this.normalizeValue(value))
                    : undefined;
            case FilterOperator.LTE:
                return value !== undefined && value !== null && !Array.isArray(value)
                    ? lte(column, this.normalizeValue(value))
                    : undefined;
            case FilterOperator.IN:
                return Array.isArray(value) && value.length > 0
                    ? inArray(
                          column,
                          value.map((v) => this.normalizeValue(v)),
                      )
                    : undefined;
            case FilterOperator.NOT_IN:
                return Array.isArray(value) && value.length > 0
                    ? notInArray(
                          column,
                          value.map((v) => this.normalizeValue(v)),
                      )
                    : undefined;
            case FilterOperator.LIKE:
                return typeof value === 'string' ? like(column, value) : undefined;
            case FilterOperator.ILIKE:
                return typeof value === 'string' ? ilike(column, value) : undefined;
            case FilterOperator.IS_NULL:
                return isNull(column);
            case FilterOperator.IS_NOT_NULL:
                return isNotNull(column);
            case FilterOperator.BETWEEN:
                if (Array.isArray(value) && value.length === 2) {
                    const [min, max] = value;
                    return between(column, this.normalizeValue(min), this.normalizeValue(max));
                }
                return undefined;
            case FilterOperator.ARRAY_CONTAINS:
                return Array.isArray(value) ? sql`${column} @> ${value}` : undefined;
            case FilterOperator.ARRAY_CONTAINED:
                return Array.isArray(value) ? sql`${column} <@ ${value}` : undefined;
            case FilterOperator.ARRAY_OVERLAPS:
                return Array.isArray(value) ? sql`${column} && ${value}` : undefined;
            default:
                return undefined;
        }
    }

    private processSortField(sortField: SortField<TField>): SQL | undefined {
        const column = this.fieldMapper.getColumn(sortField.field);
        if (!column) return undefined;

        let orderClause: SQL;

        if (sortField.order === SortOrder.DESC) {
            orderClause = desc(column);
        } else {
            orderClause = asc(column);
        }

        if (sortField.nulls === SortNullsPosition.FIRST) {
            return sql`${orderClause} NULLS FIRST`;
        } else if (sortField.nulls === SortNullsPosition.LAST) {
            return sql`${orderClause} NULLS LAST`;
        }

        return orderClause;
    }

    private normalizeValue(
        value: string | number | boolean | Date,
    ): string | number | boolean | Date {
        if (typeof value === 'string' && !isNaN(Date.parse(value))) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        return value;
    }
}
