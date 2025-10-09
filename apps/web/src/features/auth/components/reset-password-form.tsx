/**
 * ✨ PRAGMATIC ENTERPRISE: Reset Password Form
 * De 45 líneas → 10 líneas
 */

'use client';

import { AutoForm } from '@repo/ui/components/forms';
import { useRouter } from 'next/navigation';
import { newPasswordSchema, setNewPasswordAction } from '../';

export function ResetPasswordForm({ token }: { token: string }) {
    const router = useRouter();

    return (
        <AutoForm
            schema={newPasswordSchema}
            action={setNewPasswordAction}
            submitText="Reset Password"
            onSuccess={() => router.push('/login')}
            defaultValues={{ token } as any}
            fieldConfig={{
                password: {
                    label: 'New Password',
                    placeholder: '••••••••',
                    type: 'password',
                },
                confirmPassword: {
                    label: 'Confirm Password',
                    placeholder: '••••••••',
                    type: 'password',
                },
            }}
        />
    );
}
