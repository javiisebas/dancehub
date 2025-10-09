'use client';

import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { RichTextEditor } from './rich-text-editor';

interface FormRichTextFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    name: TName;
    control: Control<TFieldValues>;
    label?: string;
    description?: string;
    placeholder?: string;
    minHeight?: string;
    required?: boolean;
}

export function FormRichTextField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    name,
    control,
    label,
    description,
    placeholder,
    minHeight,
    required,
}: FormRichTextFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && (
                        <FormLabel>
                            {label}
                            {required && <span className="ml-1 text-destructive">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <RichTextEditor
                            content={field.value as string | null | undefined}
                            onChange={field.onChange}
                            placeholder={placeholder}
                            minHeight={minHeight}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
