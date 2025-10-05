export enum FilterOperator {
    EQ = 'eq',
    NE = 'ne',
    GT = 'gt',
    GTE = 'gte',
    LT = 'lt',
    LTE = 'lte',
    IN = 'in',
    NOT_IN = 'notIn',
    LIKE = 'like',
    ILIKE = 'ilike',
    IS_NULL = 'isNull',
    IS_NOT_NULL = 'isNotNull',
    BETWEEN = 'between',
    ARRAY_CONTAINS = 'arrayContains',
    ARRAY_CONTAINED = 'arrayContained',
    ARRAY_OVERLAPS = 'arrayOverlaps',
}

export enum LogicalOperator {
    AND = 'and',
    OR = 'or',
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export enum SortNullsPosition {
    FIRST = 'first',
    LAST = 'last',
}
