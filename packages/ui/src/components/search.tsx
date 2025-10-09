'use client';

import { Search as SearchIcon } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils';

export interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {}

const Search = forwardRef<HTMLInputElement, SearchProps>(
    ({ className, placeholder = 'Search...', ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                    ref={ref}
                    type="search"
                    placeholder={placeholder}
                    className={cn(
                        'flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                        className,
                    )}
                    {...props}
                />
            </div>
        );
    },
);

Search.displayName = 'Search';

export { Search };
