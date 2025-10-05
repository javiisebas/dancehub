import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageService } from '../../application/services/storage.service';

@Injectable()
export class StorageUrlInterceptor implements NestInterceptor {
    constructor(private readonly storageService: StorageService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return next.handle().pipe(
            map(async (data) => {
                if (!data) return data;

                if (Array.isArray(data)) {
                    return Promise.all(
                        data.map((item) => this.addUrlToStorage(item, user?.id || null)),
                    );
                }

                if (data.data && Array.isArray(data.data)) {
                    const dataWithUrls = await Promise.all(
                        data.data.map((item) => this.addUrlToStorage(item, user?.id || null)),
                    );
                    return { ...data, data: dataWithUrls };
                }

                return this.addUrlToStorage(data, user?.id || null);
            }),
        );
    }

    private async addUrlToStorage(item: any, userId: string | null): Promise<any> {
        if (!item || typeof item !== 'object') {
            return item;
        }

        if (item.id && item.path && item.provider) {
            try {
                if (item.visibility === 'public' && item.status === 'active') {
                    try {
                        item.url = await this.storageService.getPublicUrl(item.id);
                    } catch {
                        const presigned = await this.storageService.getPresignedUrl(
                            item.id,
                            userId,
                            3600,
                        );
                        item.url = presigned.url;
                    }
                } else if (item.status === 'active') {
                    const presigned = await this.storageService.getPresignedUrl(
                        item.id,
                        userId,
                        3600,
                    );
                    item.url = presigned.url;
                    item.urlExpiresAt = presigned.expiresAt;
                }
            } catch {
                // Si falla, no añadimos URL
            }
        }

        return item;
    }
}
