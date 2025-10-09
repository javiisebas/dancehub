import { SidebarInset } from '@repo/ui/components';
import { AppSidebar } from '@web/components/app-sidebar';
import { ReactNode } from 'react';
import { DashboardHeader } from './components/dashboard-header';
import { ProtectedProviders } from './providers';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedProviders>
            <AppSidebar />
            <SidebarInset>
                <DashboardHeader />
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
        </ProtectedProviders>
    );
}
