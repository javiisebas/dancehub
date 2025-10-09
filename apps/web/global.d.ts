import en from './messages/en.json';

type Messages = typeof en;

declare global {
    type IntlNamespaces = keyof Messages;
    interface IntlMessages extends Record<string, unknown>, Messages {}
}

import { RoleSlugEnum, UserStatusEnum } from '@repo/shared';
import { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName?: string;
            displayName?: string;
            isActive: boolean;
            status: UserStatusEnum;
            roles: RoleSlugEnum[];

            accessToken: string;
            refreshToken: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
        displayName?: string;
        isActive: boolean;
        status: UserStatusEnum;
        roles: RoleSlugEnum[];

        accessToken: string;
        refreshToken: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName?: string;
            displayName?: string;
            isActive: boolean;
            status: UserStatusEnum;
            roles: RoleSlugEnum[];
        };
        error?: string;
    }
}
