'use client';

import { RegisterForm } from '@web/features/auth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CardHeader } from '../../components/ui/cards/CardHeader';
import { DividerOr } from '../components/DividerOr';
import { SocialLogin } from '../components/SocialLogin';

export default function RegisterPage() {
    const t = useTranslations('Register');

    return (
        <>
            <CardHeader title={t('title')} subtitle={t('subtitle')} />

            <SocialLogin />

            <DividerOr />

            <RegisterForm />

            <p className="mt-2 text-center text-sm">
                Already have an account?&nbsp;
                <Link href="/login" className="text-primary hover:underline">
                    Log In
                </Link>
            </p>
        </>
    );
}
