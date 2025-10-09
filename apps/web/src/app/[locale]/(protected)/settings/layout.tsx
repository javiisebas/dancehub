import { Main } from '@web/components/layout/main';
import { SidebarNav } from '@web/components/settings/components/sidebar-nav';
import { Separator } from '@repo/ui/components/separator';
import { ReactNode } from 'react';

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Main fixed>
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                <Separator className="my-4 lg:my-6" />
                <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="top-0 lg:sticky lg:w-1/5">
                        <SidebarNav />
                    </aside>
                    <div className="flex w-full overflow-y-hidden p-1 pr-4">{children}</div>
                </div>
            </Main>
        </>
    );
}
