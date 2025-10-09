import { IconoirProvider } from 'iconoir-react';
import { ReactNode } from 'react';

export const IconProvider = ({ children }: { children: ReactNode }) => {
    return (
        <IconoirProvider
            iconProps={{
                color: 'currentColor',
                strokeWidth: 1.75,
                width: '1.5em',
                height: '1.5em',
            }}
        >
            {children}
        </IconoirProvider>
    );
};
