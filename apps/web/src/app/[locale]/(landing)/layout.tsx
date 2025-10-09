import { ReactNode } from 'react';
import { LandingFooter } from './components/LandingFooter';
import { LandingHeader } from './components/LandingHeader';

export default function LandingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <LandingHeader />
            <main className="flex-1">{children}</main>
            <LandingFooter />
        </div>
    );
}
