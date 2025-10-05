import { UserResponse } from '../../user/response/user.response';

export class LoginResponse {
    user!: UserResponse;
    accessToken!: string;
    refreshToken!: string;
}
