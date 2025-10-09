'use client';

import { Form } from '@repo/ui/components/form';
import { FC, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z, ZodSchema } from 'zod';

interface FormWrapperUIProps {
    children: ReactNode;
    onSubmit: () => void;
    form: UseFormReturn<z.TypeOf<ZodSchema>, undefined, undefined>;
}

export const FormWrapperUI: FC<FormWrapperUIProps> = ({ children, onSubmit, form }) => (
    <Form {...form}>
        <form className="grid grid-cols-1 sm:grid-cols-6 gap-3" onSubmit={onSubmit}>
            {children}
        </form>
    </Form>
);
