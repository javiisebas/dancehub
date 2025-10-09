'use client';

import { buttonVariants } from '@repo/ui/components/button';
import { Link } from '@repo/ui/components/link';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/ui/components/select';
import { cn } from '@web/utils';
import { usePathnameWithoutLocale } from '@web/hooks';
import { BellDot, Monitor, User, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const sidebarNavItems = [
    {
        title: 'Profile',
        icon: User,
        url: '/settings',
    },
    {
        title: 'Account',
        icon: Wrench,
        url: '/settings/account',
    },
    {
        title: 'Notifications',
        icon: BellDot,
        url: '/settings/notifications',
    },
    {
        title: 'Display',
        icon: Monitor,
        url: '/settings/display',
    },
];

export const SidebarNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathnameWithoutLocale();

    const router = useRouter();
    const [val, setVal] = useState(pathname ?? '/settings');

    const handleSelect = (newPath: string) => {
        setVal(newPath);
        router.push(newPath);
    };

    return (
        <>
            <div className="p-1 md:hidden">
                <Select value={val} onValueChange={handleSelect}>
                    <SelectTrigger className="h-12 sm:w-48">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        {sidebarNavItems.map((item) => (
                            <SelectItem key={item.url} value={item.url}>
                                <div className="flex gap-x-4 px-2 py-1">
                                    <span className="scale-125">
                                        <item.icon />
                                    </span>
                                    <span className="text-md">{item.title}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <ScrollArea
                orientation="horizontal"
                type="always"
                className="hidden w-full min-w-40 bg-background px-1 py-2 md:block"
            >
                <nav
                    className={cn(
                        'flex space-x-2 py-1 lg:flex-col lg:space-x-0 lg:space-y-1',
                        className,
                    )}
                    {...props}
                >
                    {sidebarNavItems.map((item) => (
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                buttonVariants({ variant: 'ghost' }),
                                pathname === item.url
                                    ? 'bg-muted no-underline hover:bg-muted hover:no-underline'
                                    : 'hover:bg-transparent hover:underline',
                                'justify-start text-secondary-foreground',
                            )}
                        >
                            <span className="mr-2">
                                <item.icon strokeWidth={1.35} size={'20px'} />
                            </span>
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </ScrollArea>
        </>
    );
};
