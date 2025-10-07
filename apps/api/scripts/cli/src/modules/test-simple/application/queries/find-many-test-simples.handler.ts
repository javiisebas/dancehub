import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { TestSimple } from '../../domain/entities/test-simple.entity';
import {
    ITestSimpleRepository,
    TEST_SIMPLE_REPOSITORY,
    TestSimpleField,
    TestSimpleRelations,
} from '../../domain/repositories/i-test-simple.repository';

export class FindManyTestSimplesQuery extends FindManyQuery<TestSimpleField, TestSimpleRelations> {}

@Injectable()
export class FindManyTestSimplesHandler extends BaseFindManyHandler<TestSimple, TestSimpleField, TestSimpleRelations> {
    constructor(@Inject(TEST_SIMPLE_REPOSITORY) repository: ITestSimpleRepository) {
        super(repository);
    }
}
