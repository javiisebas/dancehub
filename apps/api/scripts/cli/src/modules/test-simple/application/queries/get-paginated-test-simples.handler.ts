import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedTestSimpleRequest } from '@repo/shared';
import { TestSimple } from '../../domain/entities/test-simple.entity';
import {
    ITestSimpleRepository,
    TEST_SIMPLE_REPOSITORY,
    TestSimpleField,
    TestSimpleRelations,
} from '../../domain/repositories/i-test-simple.repository';

export class GetPaginatedTestSimplesQuery extends GetPaginatedQueryEnhanced<PaginatedTestSimpleRequest> {}

@Injectable()
export class GetPaginatedTestSimplesHandler extends BaseGetPaginatedHandler<
    TestSimple,
    PaginatedTestSimpleRequest,
    TestSimpleField,
    TestSimpleRelations
> {
    constructor(@Inject(TEST_SIMPLE_REPOSITORY) repository: ITestSimpleRepository) {
        super(repository);
    }
}
