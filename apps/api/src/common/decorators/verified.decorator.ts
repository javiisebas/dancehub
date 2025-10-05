import { SetMetadata } from '@nestjs/common';
import { UserStatusEnum } from '@repo/shared';

export const VERIFIED_KEY = 'verified';
export const Verified = (status: UserStatusEnum) => SetMetadata(VERIFIED_KEY, status);
