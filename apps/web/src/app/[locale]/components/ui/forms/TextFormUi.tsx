import { cn } from '@web/utils';
import { FC, ReactNode } from 'react';

interface TextFormUiProps {
    children: ReactNode;
    className?: string;
}

export const TextFormUi: FC<TextFormUiProps> = ({ children, className }) => (
    <p className={cn('text-sm text-default-500 col-span-full', className)}>{children}</p>
);
