import { NotFoundException } from '@api/common/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { UpdateTestSimpleRequest } from '@repo/shared';
import { TestSimple } from '../../domain/entities/test-simple.entity';
import {
    ITestSimpleRepository,
    TEST_SIMPLE_REPOSITORY,
} from '../../domain/repositories/i-test-simple.repository';

export class UpdateTestSimpleCommand extends UpdateCommand<UpdateTestSimpleRequest> {}

@CommandHandler(UpdateTestSimpleCommand)
export class UpdateTestSimpleHandler implements ICommandHandler<UpdateTestSimpleCommand> {
    constructor(
        @Inject(TEST_SIMPLE_REPOSITORY) private readonly repository: ITestSimpleRepository,
    ) {}

    async execute(command: UpdateTestSimpleCommand): Promise<TestSimple> {
        const { id, data } = command;

        const testSimple = await this.repository.findById(id);
        if (!testSimple) {
            throw new NotFoundException('TestSimple');
        }

        return await this.repository.save(testSimple);
    }
}
