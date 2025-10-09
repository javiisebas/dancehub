'use client';

import { RecoverForm } from '@web/features/auth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CardHeader } from '../../components/ui/cards/CardHeader';

export default function RecoverPage() {
    const t = useTranslations('Recover');

    return (
        <>
            <CardHeader title={t('title')} subtitle={t('subtitle')} />

            <RecoverForm />

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
