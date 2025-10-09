import { ButtonHTMLAttributes, HTMLAttributes, useCallback, useState } from 'react';

interface UseDisclosureProps {
    isOpen?: boolean;
    defaultOpen?: boolean;
    onClose?(): void;
    onOpen?(): void;
    onChange?(isOpen: boolean): void;
    id?: string;
}

export function useDisclosure(props?: UseDisclosureProps) {
    const { isOpen: controlledIsOpen, defaultOpen, onClose, onOpen, onChange } = props || {};
    const [isUncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);

    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : isUncontrolledOpen;

    const handleOpen = useCallback(() => {
        if (!isControlled) {
            setUncontrolledOpen(true);
        }
        if (onOpen) {
            onOpen();
        }
        if (onChange) {
            onChange(true);
        }
    }, [isControlled, onOpen, onChange]);

    const handleClose = useCallback(() => {
        if (!isControlled) {
            setUncontrolledOpen(false);
        }
        if (onClose) {
            onClose();
        }
        if (onChange) {
            onChange(false);
        }
    }, [isControlled, onClose, onChange]);

    const handleToggle = useCallback(() => {
        if (isOpen) {
            handleClose();
        } else {
            handleOpen();
        }
    }, [isOpen, handleOpen, handleClose]);

    const getButtonProps = (props?: ButtonHTMLAttributes<HTMLButtonElement>) => ({
        ...props,
        'aria-expanded': isOpen,
        onClick: handleToggle,
    });

    const getDisclosureProps = (props?: HTMLAttributes<HTMLDivElement>) => ({
        ...props,
        hidden: !isOpen,
    });

    return {
        isOpen,
        onOpen: handleOpen,
        onClose: handleClose,
        onOpenChange: handleToggle,
        isControlled,
        getButtonProps,
        getDisclosureProps,
    };
}

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>;
