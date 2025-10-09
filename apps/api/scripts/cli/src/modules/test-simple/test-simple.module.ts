import { Module } from '@nestjs/common';
import { CreateTestSimpleHandler } from './application/commands/create-test-simple.handler';
import { DeleteTestSimpleHandler } from './application/commands/delete-test-simple.handler';
import { UpdateTestSimpleHandler } from './application/commands/update-test-simple.handler';
import { FindManyTestSimplesHandler } from './application/queries/find-many-test-simples.handler';
import { GetPaginatedTestSimplesHandler } from './application/queries/get-paginated-test-simples.handler';
import { GetTestSimpleByFieldHandler } from './application/queries/get-test-simple-by-field.handler';
import { TEST_SIMPLE_REPOSITORY } from './domain/repositories/i-test-simple.repository';
import { TestSimpleController } from './infrastructure/controllers/test-simple.controller';
import { TestSimpleRepositoryImpl } from './infrastructure/repositories/test-simple.repository';
@Module({
    controllers: [TestSimpleController],
    providers: [
        { provide: TEST_SIMPLE_REPOSITORY, useClass: TestSimpleRepositoryImpl },
        CreateTestSimpleHandler,
        UpdateTestSimpleHandler,
        DeleteTestSimpleHandler,
        GetTestSimpleByFieldHandler,
        FindManyTestSimplesHandler,
        GetPaginatedTestSimplesHandler,
    ],
    exports: [TEST_SIMPLE_REPOSITORY],
})
export class TestSimpleModule {}
