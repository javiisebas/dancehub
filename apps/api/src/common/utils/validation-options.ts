import {
    HttpStatus,
    UnprocessableEntityException,
    ValidationError,
    ValidationPipeOptions,
} from '@nestjs/common';

type ValidationErrorStructure = {
    [key: string]: string | ValidationErrorStructure;
};

const generateErrors = (errors: ValidationError[]): ValidationErrorStructure => {
    return errors.reduce(
        (accumulator, currentValue) => ({
            ...accumulator,
            [currentValue.property]:
                (currentValue.children?.length ?? 0) > 0
                    ? generateErrors(currentValue.children ?? [])
                    : Object.values(currentValue.constraints ?? {}).join(', '),
        }),
        {} as ValidationErrorStructure,
    );
};

export const validationOptions: ValidationPipeOptions = {
    transform: true,
    whitelist: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: generateErrors(errors),
        });
    },
};
