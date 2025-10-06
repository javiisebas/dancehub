export abstract class Command<T> {
    constructor(public readonly data: T) {}
}

export abstract class CreateCommand<T> extends Command<T> {}

export abstract class UpdateCommand<T> {
    constructor(
        public readonly id: string,
        public readonly data: T,
    ) {}
}

export abstract class DeleteCommand {
    constructor(public readonly id: string) {}
}
