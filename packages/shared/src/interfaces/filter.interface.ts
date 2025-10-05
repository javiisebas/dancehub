import type { Filter, Sort } from '../dtos/common';

export interface IFilterable<TField extends string = string> {
    filter?: Filter<TField>;
}

export interface ISortable<TField extends string = string> {
    sort?: Sort<TField>;
}

export interface IFilterableAndSortable<TField extends string = string>
    extends IFilterable<TField>,
        ISortable<TField> {}
