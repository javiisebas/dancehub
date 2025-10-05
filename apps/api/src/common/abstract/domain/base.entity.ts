export abstract class BaseEntity {
    constructor(
        public readonly id: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}
