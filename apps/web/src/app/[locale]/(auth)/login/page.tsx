'use client';

import { LoginForm } from '@web/features/auth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CardHeader } from '../../components/ui/cards/CardHeader';
import { DividerOr } from '../components/DividerOr';
import { SocialLogin } from '../components/SocialLogin';

export default function LoginPage() {
    const t = useTranslations('Login');

    return (
        <>
            <CardHeader title={t('title')} subtitle={t('subtitle')} />

            <SocialLogin />

            <DividerOr />

            <LoginForm />

            <div className="mt-2 flex w-full flex-col items-start justify-center gap-1">
                <Link href="/recover" className="text-sm text-primary hover:underline">
                    Forgot password?
                </Link>
                <p className="text-center text-sm">
                    Need to create an account?&nbsp;
                    <Link href="/register" className="text-primary hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </>
    );
}
