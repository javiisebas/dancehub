import { FC } from 'react';

interface CardHeaderProps {
    title?: string;
    subtitle?: string;
}
export const CardHeader: FC<CardHeaderProps> = ({ title, subtitle }) => (
    <div className="flex flex-col items-start pb-2 md:pb-4">
        {title && <p className="text-xl font-medium">{title}</p>}
        {subtitle && <p className="text-sm text-secondary-foreground">{subtitle}</p>}
    </div>
);
