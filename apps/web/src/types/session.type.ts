import { RoleSlugEnum } from '@repo/shared';

export type Session = {
    user: {
        id: string;
        displayName: string | undefined;
        role: RoleSlugEnum;
    };
    accessToken: string;
    refreshToken: string;
};
