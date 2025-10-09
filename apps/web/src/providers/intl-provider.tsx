'use client';

import { Locale } from '@web/types/locale.type';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

export interface IntlProviderProps {
    children: ReactNode;
    locale: Locale;
    messages: AbstractIntlMessages;
}

export function IntlProvider({ children, locale, messages }: IntlProviderProps) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
