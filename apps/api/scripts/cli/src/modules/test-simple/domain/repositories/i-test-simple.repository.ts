import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { testSimples } from '../../infrastructure/schemas/test-simple.schema';
import { TestSimple } from '../entities/test-simple.entity';

export const TEST_SIMPLE_REPOSITORY = Symbol('TEST_SIMPLE_REPOSITORY');

export type TestSimpleField = InferFields<typeof testSimples>;
export type TestSimpleRelations = {};

export interface ITestSimpleRepository
    extends IBaseRepository<TestSimple, TestSimpleField, TestSimpleRelations> {}
