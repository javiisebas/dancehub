'use client';

import { Button, Input } from '@repo/ui/components';
import { useFormWithSchema } from '@web/hooks';
import { useTranslations } from 'next-intl';
import { registerSchema, useRegister } from '../';

export function RegisterForm() {
    const t = useTranslations('Register');
    const tForms = useTranslations('Forms');

    const { mutate: register, isPending: isLoading } = useRegister();
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useFormWithSchema({
        schema: registerSchema,
        onSubmit: register,
    });

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label={tForms('firstName.label')}
                placeholder={tForms('firstName.placeholder')}
                {...formRegister('firstName')}
                error={errors.firstName?.message}
            />

            <Input
                label={tForms('lastName.label')}
                placeholder={tForms('lastName.placeholder')}
                {...formRegister('lastName')}
                error={errors.lastName?.message}
            />

            <Input
                label={tForms('email.label')}
                placeholder={tForms('email.placeholder')}
                type="email"
                {...formRegister('email')}
                error={errors.email?.message}
            />

            <Input
                label={tForms('password.label')}
                placeholder={tForms('password.placeholder')}
                type="password"
                {...formRegister('password')}
                error={errors.password?.message}
            />

            <Input
                label={tForms('confirmPassword.label')}
                placeholder={tForms('confirmPassword.placeholder')}
                type="password"
                {...formRegister('confirmPassword')}
                error={errors.confirmPassword?.message}
            />

            <Button type="submit" loading={isLoading}>
                Sign Up
            </Button>
        </form>
    );
}
