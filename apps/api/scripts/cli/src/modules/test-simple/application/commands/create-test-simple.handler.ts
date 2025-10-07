import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateTestSimpleRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { TestSimple } from '../../domain/entities/test-simple.entity';
import {
    ITestSimpleRepository,
    TEST_SIMPLE_REPOSITORY,
} from '../../domain/repositories/i-test-simple.repository';

export class CreateTestSimpleCommand extends CreateCommand<CreateTestSimpleRequest> {}

@Injectable()
export class CreateTestSimpleHandler {
    constructor(
        @Inject(TEST_SIMPLE_REPOSITORY) private readonly repository: ITestSimpleRepository,
    ) {}

    async execute({ data }: CreateTestSimpleCommand) {
        const testSimple = TestSimple.create(
            randomUUID(),
        );

        return this.repository.save(testSimple);
    }
}