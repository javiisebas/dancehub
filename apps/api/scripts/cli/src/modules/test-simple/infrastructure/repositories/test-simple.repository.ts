import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { TestSimple } from '../../domain/entities/test-simple.entity';
import { ITestSimpleRepository } from '../../domain/repositories/i-test-simple.repository';
import { testSimples } from '../schemas/test-simple.schema';

@Injectable()
export class TestSimpleRepositoryImpl
    extends BaseRepository<TestSimple, typeof testSimples>
    implements ITestSimpleRepository
{
    protected readonly table = testSimples;
    protected readonly entityName = 'TestSimple';

    protected toDomain(schema: typeof testSimples.$inferSelect): TestSimple {
        return new TestSimple(
            schema.id,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: TestSimple): any {
        return {
        };
    }
}