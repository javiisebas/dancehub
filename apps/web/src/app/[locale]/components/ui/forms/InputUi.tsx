'use client';

import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { cn } from '@web/utils';

import { FC, forwardRef, ReactNode, useId } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

export interface InputUiProps {
    endContent?: ReactNode;
    error?: FieldError | undefined;
    isRequired?: boolean;
    label: string;
    placeholder: string;
    register: UseFormRegisterReturn;
    type?: string | undefined;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
}

const InputUi: FC<InputUiProps> = forwardRef<HTMLInputElement, InputUiProps>(
    (
        {
            endContent,
            error,
            isRequired = true,
            label,
            placeholder,
            register,
            type,
            className,
            inputClassName,
            labelClassName,
            ...props
        },
        ref,
    ) => {
        const inputId = useId();

        return (
            <div className={cn('grid w-full max-w-sm items-center gap-1.5 col-span-6', className)}>
                <Label
                    htmlFor={inputId}
                    className={cn(
                        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                        labelClassName,
                    )}
                >
                    {label}
                    {isRequired && <span className="text-red-500">*</span>}{' '}
                </Label>
                <div className="relative">
                    <Input
                        id={inputId}
                        type={type}
                        placeholder={placeholder}
                        required={isRequired}
                        aria-invalid={!!error}
                        {...register}
                        className={inputClassName}
                        ref={ref}
                        {...props}
                    />
                    {endContent && (
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
                            {endContent}
                        </div>
                    )}
                </div>

                {error && <p className="text-sm text-red-500 mt-1">{error?.message?.toString()}</p>}
            </div>
        );
    },
);
InputUi.displayName = 'InputUi';

export { InputUi };
