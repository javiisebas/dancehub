import { FC } from 'react';
import { InputUi, InputUiProps } from './InputUi';

export const EmailInputUi: FC<Omit<InputUiProps, 'type'>> = (props) => (
    <InputUi type="email" {...props} />
);
