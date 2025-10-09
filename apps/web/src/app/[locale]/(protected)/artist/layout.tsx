'use client';

import { Button } from '@repo/ui/components';
import { BarChart3, BookOpen, FolderOpen, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/artist', icon: BarChart3 },
    { name: 'My Courses', href: '/artist/courses', icon: FolderOpen },
    { name: 'Students', href: '/artist/students', icon: Users },
    { name: 'Create Course', href: '/artist/courses/new', icon: BookOpen },
    { name: 'Settings', href: '/artist/settings', icon: Settings },
];

export default function ArtistLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-background">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/artist" className="text-xl font-bold text-primary">
                        DanceHub Artist
                    </Link>
                </div>
                <nav className="space-y-1 p-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className="w-full justify-start gap-3"
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1">
                <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-16 items-center justify-between px-8">
                        <h1 className="text-lg font-semibold">Artist Studio</h1>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="outline" size="sm">
                                    View as Student
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
