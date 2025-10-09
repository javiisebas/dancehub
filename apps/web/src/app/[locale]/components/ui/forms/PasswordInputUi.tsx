'use client';

import { Icon } from '@iconify/react';
import { usePasswordVisibility } from '@web/hooks/use-password-visibility.hook';
import { FC } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { InputUi } from './InputUi';

interface PasswordInputUiProps {
    error?: FieldError | undefined;
    label: string;
    placeholder: string;
    register: UseFormRegisterReturn;
}

export const PasswordInputUi: FC<PasswordInputUiProps> = (props) => {
    const { isVisible, toggleVisibility } = usePasswordVisibility();

    return (
        <InputUi
            endContent={
                <button type="button" onClick={toggleVisibility}>
                    <Icon
                        className="text-2xl text-default-400"
                        icon={isVisible ? 'solar:eye-closed-linear' : 'solar:eye-bold'}
                    />
                </button>
            }
            type={isVisible ? 'text' : 'password'}
            {...props}
        />
    );
};
