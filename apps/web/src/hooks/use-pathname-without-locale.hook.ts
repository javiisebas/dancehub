import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export function usePathnameWithoutLocale() {
    const pathname = usePathname();
    const locale = useLocale();

    if (pathname && locale && pathname.startsWith(`/${locale}`)) {
        return pathname.slice(locale.length + 1) || '/';
    }

    return pathname;
}
