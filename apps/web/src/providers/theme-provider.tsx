/**
 * 🎨 THEME PROVIDER
 *
 * Sistema de temas dark/light con next-themes
 * - Auto-detecta preferencias del sistema
 * - Persiste en localStorage
 * - Sin flash de contenido
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}
