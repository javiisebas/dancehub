import { UNIT_OF_WORK_KEY } from './unit-of-work.constants';

export function UnitOfWork(): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(UNIT_OF_WORK_KEY, true, descriptor.value);
        return descriptor;
    };
}
