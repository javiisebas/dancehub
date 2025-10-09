import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    ITestSimpleRepository,
    TEST_SIMPLE_REPOSITORY,
} from '../../domain/repositories/i-test-simple.repository';

export class DeleteTestSimpleCommand extends DeleteCommand {}

@Injectable()
export class DeleteTestSimpleHandler {
    constructor(
        @Inject(TEST_SIMPLE_REPOSITORY) private readonly repository: ITestSimpleRepository,
    ) {}

    async execute({ id }: DeleteTestSimpleCommand): Promise<void> {
        await this.repository.delete(id);
    }
}
