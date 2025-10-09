import { Button } from '@repo/ui/components/button';
import { FC, ReactNode } from 'react';

export interface ButtonSubmitUiProps {
    isLoading: boolean;
    isDisabled?: boolean;
    children: ReactNode;
}

export const ButtonSubmitUi: FC<ButtonSubmitUiProps> = ({
    children,
    isLoading,
    isDisabled = false,
}) => {
    return (
        <Button
            loading={isLoading}
            disabled={isDisabled}
            className="col-span-full mt-2"
            type="submit"
        >
            {children}
        </Button>
    );
};
