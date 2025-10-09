'use client';

import { Button } from '@repo/ui/components';
import { useVerifyEmail } from '@web/features/auth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CardHeader } from '../../components/ui/cards/CardHeader';

export default function VerifyEmailPage() {
    const t = useTranslations('VerifyEmail');
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const { data, isLoading, isError, error } = useVerifyEmail(token);

    if (!token) {
        return (
            <div className="flex flex-col gap-4 text-center">
                <CardHeader title={t('title')} subtitle="Invalid or missing token" />
                <p className="text-muted-foreground">
                    The verification link is invalid or has expired.
                </p>
                <Link href="/login">
                    <Button>Go to Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 text-center">
            <CardHeader title={t('title')} subtitle={t('subtitle')} />

            {isLoading && (
                <div className="flex flex-col gap-2">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Verifying your email...</p>
                </div>
            )}

            {isError && (
                <div className="flex flex-col gap-4">
                    <p className="text-destructive">
                        {(error as Error)?.message || 'Failed to verify email'}
                    </p>
                    <Link href="/login">
                        <Button>Go to Login</Button>
                    </Link>
                </div>
            )}

            {data && !isLoading && (
                <div className="flex flex-col gap-4">
                    <p className="font-medium text-green-600">Email verified successfully! ✓</p>
                    <p className="text-muted-foreground">You can now log in to your account.</p>
                    <Link href="/login">
                        <Button>Go to Login</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
