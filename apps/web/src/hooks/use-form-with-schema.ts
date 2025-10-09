import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { z, ZodSchema } from 'zod';

export type UseFormWithSchemaProps<T extends ZodSchema> = Omit<
    UseFormProps<z.infer<T>>,
    'resolver'
> & {
    schema: T;
};

export function useFormWithSchema<T extends ZodSchema>(
    props: UseFormWithSchemaProps<T>,
): UseFormReturn<z.infer<T>> {
    const { schema, ...formProps } = props;

    return useForm<z.infer<T>>({
        ...formProps,
        resolver: zodResolver(schema),
    });
}
