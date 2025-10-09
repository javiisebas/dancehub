export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export interface SortField<TField extends string = string> {
    field: TField;
    order: SortOrder;
}
