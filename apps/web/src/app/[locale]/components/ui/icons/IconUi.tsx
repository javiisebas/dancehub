'use client';

import {
    Check,
    CheckCircle,
    HelpCircle,
    InfoCircle,
    Journal,
    Lock,
    LogOut,
    Settings,
    Translate,
    WarningTriangle,
    XmarkCircle,
} from 'iconoir-react';

export const IconEnum = {
    ADMIN: Lock,
    CHECK_CIRCLE: CheckCircle,
    CHECK: Check,
    ERROR_CIRCLE: XmarkCircle,
    HELP_CIRCLE: HelpCircle,
    INFO_CIRCLE: InfoCircle,
    LOGOUT: LogOut,
    SETTINGS: Settings,
    TICKET: Journal,
    TRANSLATE: Translate,
    WARNING: WarningTriangle,
};

type IconKey = keyof typeof IconEnum;

interface IconUiProps {
    icon: IconKey;
    className?: string;
}

export const IconUi = ({ icon, className }: IconUiProps) => {
    const IconComponent = IconEnum[icon];

    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} />;
};
