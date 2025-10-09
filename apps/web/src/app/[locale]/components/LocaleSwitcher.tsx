'use client';

import { LocalesEnum } from '@repo/shared';
import { Link, usePathname } from '@web/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

export const LocaleSwitcher = () => {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale();
    const otherLocale = locale === LocalesEnum.EN ? LocalesEnum.ES : LocalesEnum.EN;
    const pathname = usePathname();

    return (
        <Link href={pathname} locale={otherLocale}>
            {t('switchLocale', { locale: otherLocale })}
        </Link>
    );
};
