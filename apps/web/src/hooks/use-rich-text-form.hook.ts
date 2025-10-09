import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

interface UseRichTextFormOptions<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    name: TName;
    control: Control<TFieldValues>;
}

export function useRichTextForm<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control }: UseRichTextFormOptions<TFieldValues, TName>) {
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return {
        content: value as string | undefined,
        onChange,
        error,
        hasError: !!error,
        errorMessage: error?.message,
    };
}
