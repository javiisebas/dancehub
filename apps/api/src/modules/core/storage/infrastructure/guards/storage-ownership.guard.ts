import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
} from '@nestjs/common';
import {
    IStorageRepository,
    STORAGE_REPOSITORY,
} from '../../domain/repositories/i-storage.repository';

@Injectable()
export class StorageOwnershipGuard implements CanActivate {
    constructor(@Inject(STORAGE_REPOSITORY) private readonly repository: IStorageRepository) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const storageId = request.params.id;
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        if (!storageId) {
            return true;
        }

        const storage = await this.repository.findById(storageId);
        if (!storage) {
            throw new ForbiddenException('Storage not found');
        }

        if (!storage.belongsToUser(user.id)) {
            throw new ForbiddenException('You do not own this file');
        }

        request.storage = storage;

        return true;
    }
}
