/**
 * 🔐 SOCIAL LOGIN COMPONENT
 *
 * Renderiza botones OAuth dinámicamente
 * - Google OAuth
 * - Loading states
 * - Error handling
 * - Professional UI
 */

'use client';

import { Icon } from '@iconify/react';
import { Button } from '@repo/ui/components/button';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type OAuthProvider = 'google';

interface ProviderConfig {
    id: OAuthProvider;
    name: string;
    icon: string;
}

/**
 * Configuración de providers
 */
const PROVIDERS: ProviderConfig[] = [
    {
        id: 'google',
        name: 'Google',
        icon: 'flat-color-icons:google',
    },
];

/**
 * Component
 */
export function SocialLogin() {
    const t = useTranslations('SocialLogin');
    const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);

    const handleSocialLogin = async (provider: OAuthProvider) => {
        try {
            setLoadingProvider(provider);

            // Usar callbackUrl para mejor UX
            await signIn(provider, {
                callbackUrl: '/profile',
                redirect: true,
            });
        } catch (error) {
            console.error(`${provider} login error:`, error);
            setLoadingProvider(null);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {PROVIDERS.map((provider) => (
                <Button
                    key={provider.id}
                    onClick={() => handleSocialLogin(provider.id)}
                    variant="outline-primary"
                    disabled={loadingProvider !== null}
                    loading={loadingProvider === provider.id}
                    className="relative"
                >
                    {loadingProvider !== provider.id && (
                        <Icon icon={provider.icon} width={20} height={20} />
                    )}
                    <span className="ml-2">{t('google')}</span>
                </Button>
            ))}
        </div>
    );
}
