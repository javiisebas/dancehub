export abstract class CreateCommand<T> {
    constructor(public readonly data: T) {}
}

export abstract class UpdateCommand<T> {
    constructor(
        public readonly id: string,
        public readonly data: T,
    ) {}
}

export abstract class DeleteCommand {
    constructor(public readonly id: string) {}
}
