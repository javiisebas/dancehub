export abstract class BaseEntity {
    constructor(
        public readonly id: string,
        public readonly createdAt: Date,
        public updatedAt: Date,
    ) {}

    protected touch(): void {
        this.updatedAt = new Date();
    }
}
