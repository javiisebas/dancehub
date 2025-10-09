import { BaseEntity } from '@api/common/abstract/domain';

export class TestSimple extends BaseEntity {
    constructor(id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
    }

    static create(id: string): TestSimple {
        const now = new Date();
        return new TestSimple(id, now, now);
    }
}
