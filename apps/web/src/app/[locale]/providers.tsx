'use client';

import { AppProviders } from '@web/providers';
import { Locale } from '@web/types';
import { AbstractIntlMessages } from 'next-intl';
import { ReactNode } from 'react';
import { IconProvider } from './components/ui/icons/IconProvider';

export interface RootProvidersProps {
    children: ReactNode;
    locale: Locale;
    messages: AbstractIntlMessages;
}

export function RootProviders({ children, locale, messages }: RootProvidersProps) {
    return (
        <AppProviders locale={locale} messages={messages}>
            <IconProvider>{children}</IconProvider>
        </AppProviders>
    );
}
