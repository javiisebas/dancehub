/**
 * ✨ PRAGMATIC ENTERPRISE: Login Form
 *
 * De 70 líneas → 10 líneas
 * - Type-safe automático
 * - Validación desde schema
 * - Loading/error states automáticos
 * - Progressive enhancement
 */

'use client';

import { AutoForm } from '@repo/ui/components/forms';
import { useRouter } from 'next/navigation';
import { loginAction, loginSchema } from '../';

export function LoginForm() {
    const router = useRouter();

    return (
        <AutoForm
            schema={loginSchema}
            action={loginAction}
            submitText="Log in"
            onSuccess={() => router.push('/dashboard')}
            fieldConfig={{
                email: {
                    label: 'Email',
                    placeholder: 'you@example.com',
                    type: 'email',
                },
                password: {
                    label: 'Password',
                    placeholder: '••••••••',
                    type: 'password',
                },
            }}
        />
    );
}
