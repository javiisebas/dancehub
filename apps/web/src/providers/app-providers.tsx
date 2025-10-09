'use client';

import 'reflect-metadata';

import { Locale } from '@web/types/locale.type';
import { AbstractIntlMessages } from 'next-intl';
import { ReactNode, useEffect } from 'react';
import { IntlProvider } from './intl-provider';
import { QueryProvider } from './query-provider';

export interface AppProvidersProps {
    children: ReactNode;
    locale: Locale;
    messages: AbstractIntlMessages;
}

export function AppProviders({ children, locale, messages }: AppProvidersProps) {
    useEffect(() => {
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.log('🚀 App initialized with locale:', locale);
        }
    }, [locale]);

    return (
        <QueryProvider>
            <IntlProvider locale={locale} messages={messages}>
                {children}
            </IntlProvider>
        </QueryProvider>
    );
}
