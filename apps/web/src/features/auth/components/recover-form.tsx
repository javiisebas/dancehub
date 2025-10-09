/**
 * ✨ PRAGMATIC ENTERPRISE: Recover Password Form
 * De 37 líneas → 10 líneas
 */

'use client';

import { AutoForm } from '@repo/ui/components/forms';
import { resetPasswordAction, resetPasswordSchema } from '../';

export function RecoverForm() {
    return (
        <AutoForm
            schema={resetPasswordSchema}
            action={resetPasswordAction}
            submitText="Send Reset Link"
            fieldConfig={{
                email: {
                    label: 'Email',
                    placeholder: 'you@example.com',
                    type: 'email',
                    description: 'We will send you a password reset link',
                },
            }}
        />
    );
}
