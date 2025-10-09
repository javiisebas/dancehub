'use client';
import { signIn, useSession } from 'next-auth/react';
import Script from 'next/script';
import { memo, useEffect, useRef } from 'react';

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        clientId: string;
                        callback: (response: { credential: string }) => void;
                    }) => void;
                    prompt: () => void;
                    hasImpromptuPrompt: () => boolean;
                    storeCredential: (
                        credential: Record<'credential', string> | undefined,
                    ) => Promise<void>;
                    cancelPrompt: () => void;
                };
            };
        };
    }
}

export const GoogleOneTapComponent = () => {
    const { data: session } = useSession();
    const oneTapInitialized = useRef(false);

    useEffect(() => {
        if (session) {
            return;
        }

        if (typeof window === 'undefined' || !window.google || oneTapInitialized.current) {
            return;
        }

        window.google.accounts.id.initialize({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: async (response) => {
                oneTapInitialized.current = false;
                try {
                    await signIn('google-one-tap', {
                        credential: response.credential,
                        redirect: false,
                    });
                } catch (error) {
                    console.error('Google One Tap SignIn Error:', error);
                }
            },
        });
        oneTapInitialized.current = true;

        window.google.accounts.id.prompt();

        return () => {
            if (window.google?.accounts?.id?.cancelPrompt) {
                window.google.accounts.id.cancelPrompt();
            }
            oneTapInitialized.current = false;
        };
    }, [session]);

    return (
        <div>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="beforeInteractive"
                onLoad={() => {}}
                onError={() => {
                    console.error('Error loading Google Identity Services Library.');
                }}
            />
        </div>
    );
};

export const GoogleOneTap = memo(GoogleOneTapComponent);
