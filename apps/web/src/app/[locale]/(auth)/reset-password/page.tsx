'use client';

import { ResetPasswordForm } from '@web/features/auth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CardHeader } from '../../components/ui/cards/CardHeader';

export default function ResetPasswordPage() {
    const t = useTranslations('ResetPassword');
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    if (!token) {
        return (
            <div className="flex flex-col gap-4 text-center">
                <CardHeader title={t('title')} subtitle="Invalid or missing token" />
                <p className="text-muted-foreground">
                    The reset password link is invalid or has expired.
                </p>
                <Link href="/recover" className="text-primary hover:underline">
                    Request a new reset link
                </Link>
            </div>
        );
    }

    return (
        <>
            <CardHeader title={t('title')} subtitle={t('subtitle')} />

            <ResetPasswordForm token={token} />

            <div className="mt-2 flex w-full flex-col items-start justify-center gap-1">
                <p className="text-center text-sm">
                    Remember your password?&nbsp;
                    <Link href="/login" className="text-primary hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </>
    );
}
