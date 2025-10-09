export class QueryBuilder {
    private params: URLSearchParams;

    constructor(baseParams?: Record<string, unknown>) {
        this.params = new URLSearchParams();
        if (baseParams) {
            this.addParams(baseParams);
        }
    }

    add(key: string, value: unknown): this {
        if (value !== undefined && value !== null) {
            if (typeof value === 'object') {
                this.params.append(key, JSON.stringify(value));
            } else {
                this.params.append(key, String(value));
            }
        }
        return this;
    }

    addParams(params: Record<string, unknown>): this {
        Object.entries(params).forEach(([key, value]) => {
            this.add(key, value);
        });
        return this;
    }

    addIf(condition: boolean, key: string, value: unknown): this {
        if (condition) {
            this.add(key, value);
        }
        return this;
    }

    addPagination(page?: number, limit?: number): this {
        if (page !== undefined) this.add('page', page);
        if (limit !== undefined) this.add('limit', limit);
        return this;
    }

    addSort(sort: Record<string, 'asc' | 'desc'>): this {
        if (Object.keys(sort).length > 0) {
            this.add('sort', sort);
        }
        return this;
    }

    addFilter(filter: Record<string, unknown>): this {
        if (Object.keys(filter).length > 0) {
            this.add('filter', filter);
        }
        return this;
    }

    addSearch(searchTerm: string, searchFields?: string[]): this {
        if (searchTerm) {
            this.add('search', searchTerm);
            if (searchFields && searchFields.length > 0) {
                this.add('searchFields', searchFields);
            }
        }
        return this;
    }

    addDateRange(startDate?: Date, endDate?: Date, fieldName: string = 'createdAt'): this {
        if (startDate) {
            this.add(`${fieldName}From`, startDate.toISOString());
        }
        if (endDate) {
            this.add(`${fieldName}To`, endDate.toISOString());
        }
        return this;
    }

    build(): string {
        const queryString = this.params.toString();
        return queryString ? `?${queryString}` : '';
    }

    buildWithBase(baseUrl: string): string {
        const queryString = this.params.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    }

    toString(): string {
        return this.build();
    }

    static create(params?: Record<string, unknown>): QueryBuilder {
        return new QueryBuilder(params);
    }
}
