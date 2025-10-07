# 📦 Storage Module - Guía Completa

Sistema de almacenamiento escalable con optimización automática, thumbnails y progress tracking en tiempo real.

## 🎯 Características

-   ✅ **Builder Pattern**: API fluida para crear entities
-   ✅ **Strategy Pattern**: Procesadores extensibles
-   ✅ **Type-Safe Pipeline**: Upload flow con inferencia de tipos
-   ✅ **Auto-Optimization**: WebP para imágenes, H.264 para videos
-   ✅ **Thumbnails**: 3 tamaños generados automáticamente
-   ✅ **Progress Tracking**: WebSocket en tiempo real
-   ✅ **Access Control**: PUBLIC, PRIVATE, AUTHENTICATED
-   ✅ **Multiple Providers**: R2, S3 (extensible)

---

## 🚀 Quick Start

### 1. Upload Simple

```typescript
@Controller('files')
export class MyController {
    constructor(private readonly storageService: StorageService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
        const storage = await this.storageService.uploadFile(file, user.id, {
            visibility: StorageVisibilityEnum.PRIVATE,
            metadata: { description: 'User avatar' },
        });

        return { id: storage.id, path: storage.path };
    }
}
```

### 2. Crear Storage con Builder

```typescript
const storage = StorageBuilder.create()
    .withFile({
        filename: 'photo_123.webp',
        originalName: 'photo.jpg',
        mimeType: 'image/webp',
        size: 102400,
    })
    .withExtension('webp')
    .withPath('users/user-123/2025/01/photo_123.webp')
    .asPublic() // o .asPrivate() o .asAuthenticated()
    .asActive()
    .withUser('user-123')
    .withMetadata({ description: 'Profile photo', tags: ['avatar'] })
    .build();

await storageRepository.save(storage);
```

---

## 📚 Uso Avanzado

### 1. Access Control

```typescript
// Obtener URL firmada (presigned)
const { url, expiresAt } = await storageService.getPresignedUrl(
    storageId,
    userId,
    3600, // expira en 1 hora
);

// Obtener URL pública (solo si visibility = PUBLIC)
const publicUrl = await storageService.getPublicUrl(storageId);

// Eliminar archivo
await storageService.deleteFile(storageId, userId);
```

### 2. Visibilidad

```typescript
// PUBLIC: Accesible por cualquiera
const storage = StorageBuilder.create().withFile(file).asPublic().build();

// PRIVATE: Solo el propietario
const storage = StorageBuilder.create().withFile(file).asPrivate().withUser(userId).build();

// AUTHENTICATED: Cualquier usuario autenticado
const storage = StorageBuilder.create().withFile(file).asAuthenticated().build();
```

### 3. Progress Tracking (WebSocket)

```typescript
// Frontend
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
    auth: { token: 'your-jwt-token' },
});

// Escuchar eventos de progreso
socket.on('upload:start', ({ uploadId, filename }) => {
    console.log(`Upload started: ${filename}`);
});

socket.on('processing:start', ({ uploadId, type }) => {
    console.log(`Processing ${type}...`);
});

socket.on('processing:progress', ({ uploadId, progress, message }) => {
    console.log(`${progress}%: ${message}`);
});

socket.on('thumbnail:generating', ({ uploadId }) => {
    console.log('Generating thumbnails...');
});

socket.on('upload:complete', ({ uploadId, storageId }) => {
    console.log(`Upload complete! Storage ID: ${storageId}`);
});

socket.on('upload:error', ({ uploadId, error }) => {
    console.error(`Upload failed: ${error}`);
});
```

---

## 🏗️ Arquitectura

### Servicios Principales

#### StorageService

Servicio principal para operaciones de storage.

```typescript
class StorageService {
    // Upload file con optimización automática
    uploadFile(file, userId, request, uploadId?): Promise<Storage>;

    // Obtener URL firmada temporal
    getPresignedUrl(storageId, userId, expiresIn): Promise<{ url; expiresAt }>;

    // Obtener URL pública
    getPublicUrl(storageId): Promise<string>;

    // Eliminar archivo
    deleteFile(storageId, userId): Promise<void>;
}
```

#### FileUploadPipeline

Pipeline type-safe para upload de archivos.

```typescript
class FileUploadPipeline {
    async execute(context, provider, saveStorage): Promise<UploadResult> {
        // 1. Start tracking
        // 2. Process file (optimize si aplicable)
        // 3. Upload to provider
        // 4. Create storage entity
        // 5. Generate thumbnails (async)
        // 6. Complete
    }
}
```

#### StorageAccessService

Control de acceso centralizado.

```typescript
class StorageAccessService {
    // Verificar acceso de lectura
    verifyReadAccess(storage, userId): void;

    // Verificar acceso de escritura
    verifyWriteAccess(storage, userId): void;

    // Verificar acceso de eliminación
    verifyDeleteAccess(storage, userId): void;

    // Check booleano (no throw)
    canUserAccess(storage, userId): boolean;
    doesUserOwn(storage, userId): boolean;
}
```

#### StoragePathService

Generación consistente de paths.

```typescript
class StoragePathService {
    // Generar filename único
    generateFilename(originalFilename, newExtension?): string;

    // Generar path organizado por fecha
    // users/{userId}/{year}/{month}/{filename}
    // public/{year}/{month}/{filename}
    generatePath(userId, filename): string;

    // Path para thumbnails
    generateThumbnailPath(originalPath, size): string;

    // Utilidades
    extractUserIdFromPath(path): string | null;
    isPublicPath(path): boolean;
}
```

---

## 🔧 File Processors

### Añadir Nuevo Processor

```typescript
// 1. Crear processor
@Injectable()
export class PDFProcessor extends BaseFileProcessor {
    canProcess(mimeType: string): boolean {
        return mimeType === 'application/pdf';
    }

    async process(file: Express.Multer.File): Promise<ProcessedFile> {
        // Tu lógica de optimización PDF
        const optimizedBuffer = await this.optimizePDF(file.buffer);

        return this.createProcessedFile(optimizedBuffer, 'pdf', 'application/pdf', {
            pages: 10,
            compressed: true,
        });
    }

    getName(): string {
        return 'PDFProcessor';
    }
}

// 2. Registrar en module
@Module({
    providers: [
        PDFProcessor,
        {
            provide: FileProcessorRegistry,
            useFactory: (
                imageProc: ImageProcessor,
                videoProc: VideoProcessor,
                pdfProc: PDFProcessor, // Nuevo
            ) => {
                const registry = new FileProcessorRegistry();
                registry.register(imageProc);
                registry.register(videoProc);
                registry.register(pdfProc); // Registrar
                return registry;
            },
            inject: [ImageProcessor, VideoProcessor, PDFProcessor],
        },
    ],
})
export class StorageModule {}
```

---

## 🔌 Storage Providers

### Usar Provider Existente (R2)

```typescript
// .env
STORAGE_R2_ACCOUNT_ID=your_account_id
STORAGE_R2_ACCESS_KEY_ID=your_access_key
STORAGE_R2_SECRET_ACCESS_KEY=your_secret_key
STORAGE_R2_BUCKET=your_bucket_name
STORAGE_R2_PUBLIC_URL=https://your-domain.com  # Opcional
```

### Crear Nuevo Provider (S3)

```typescript
@Injectable()
export class S3StorageProvider implements IStorageProvider {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    async upload(file: Express.Multer.File, path: string): Promise<UploadResult> {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: path,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.client.send(command);

        return {
            path,
            size: file.size,
            providerId: `s3://${process.env.AWS_BUCKET}/${path}`,
        };
    }

    async delete(path: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: path,
        });

        await this.client.send(command);
    }

    async getPresignedUrl(path: string, expiresIn: number): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: path,
        });

        return getSignedUrl(this.client, command, { expiresIn });
    }

    getPublicUrl(path: string): string {
        return `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${path}`;
    }
}

// Registrar en module
@Module({
    providers: [
        {
            provide: 'STORAGE_PROVIDER',
            useClass: S3StorageProvider, // Cambiar aquí
        },
    ],
})
export class StorageModule {}
```

---

## 🎨 Thumbnails

### Configuración

```typescript
// apps/api/src/modules/core/storage/application/constants/storage.constants.ts

export const STORAGE_CONSTANTS = {
    THUMBNAIL_SIZES: {
        SMALL: { width: 150, height: 150 },
        MEDIUM: { width: 300, height: 300 },
        LARGE: { width: 600, height: 600 },
    },
} as const;
```

### Obtener Thumbnails

```typescript
// Los thumbnails se guardan en tabla storage_thumbnails
const thumbnails = await db
    .select()
    .from(storageThumbnails)
    .where(eq(storageThumbnails.storageId, storageId));

// thumbnails = [
//   { id: '...', size: 'small', width: 150, height: 150, path: '...', fileSize: 2048 },
//   { id: '...', size: 'medium', width: 300, height: 300, path: '...', fileSize: 5120 },
//   { id: '...', size: 'large', width: 600, height: 600, path: '...', fileSize: 15360 },
// ]
```

---

## 🧪 Testing

```typescript
describe('StorageBuilder', () => {
    it('should build storage with fluent API', () => {
        const storage = StorageBuilder.create()
            .withFile({
                filename: 'test.jpg',
                originalName: 'test.jpg',
                mimeType: 'image/jpeg',
                size: 1024,
            })
            .withExtension('jpg')
            .withPath('/test/path.jpg')
            .asPublic()
            .asActive()
            .build();

        expect(storage.filename).toBe('test.jpg');
        expect(storage.isPublic()).toBe(true);
        expect(storage.isActive()).toBe(true);
    });
});

describe('StorageAccessService', () => {
    it('should verify read access for public files', () => {
        const publicStorage = createPublicStorage();

        expect(() => {
            accessService.verifyReadAccess(publicStorage, null);
        }).not.toThrow();
    });

    it('should throw for private files without owner', () => {
        const privateStorage = createPrivateStorage('user-123');

        expect(() => {
            accessService.verifyReadAccess(privateStorage, 'user-456');
        }).toThrow(ForbiddenException);
    });
});
```

---

## 📊 Límites y Configuración

```typescript
export const STORAGE_CONSTANTS = {
    FILE_SIZE_LIMITS: {
        IMAGE: 5 * 1024 * 1024, // 5MB
        VIDEO: 100 * 1024 * 1024, // 100MB
        DOCUMENT: 10 * 1024 * 1024, // 10MB
        AUDIO: 20 * 1024 * 1024, // 20MB
        DEFAULT: 10 * 1024 * 1024, // 10MB
    },

    IMAGE_OPTIMIZATION: {
        MAX_WIDTH: 2048,
        MAX_HEIGHT: 2048,
        QUALITY: 85,
        FORMAT: 'webp',
    },

    VIDEO_OPTIMIZATION: {
        MAX_WIDTH: 1920,
        CRF: 23,
        PRESET: 'medium',
        FORMAT: 'mp4',
    },

    CLEANUP: {
        SOFT_DELETE_RETENTION_DAYS: 30,
        FAILED_UPLOAD_RETENTION_HOURS: 24,
    },
} as const;
```

---

## 🚀 Best Practices

1. **Siempre usar Builder Pattern** para crear Storage entities
2. **Validar tamaños de archivo** antes de upload
3. **Usar visibility adecuada** según el caso de uso
4. **Implementar cleanup jobs** para archivos antiguos
5. **Monitorear uso de storage** para costos
6. **Cachear URLs públicas** si es posible
7. **Usar presigned URLs** para archivos privados
8. **Manejar errores** de upload gracefully
9. **Testear processors** individualmente
10. **Documentar metadata** custom

---

## 🔍 Troubleshooting

### Upload falla

-   Verificar permisos de storage provider
-   Revisar límites de tamaño
-   Comprobar conexión a provider

### Thumbnails no se generan

-   Verificar que ffmpeg esté instalado (para videos)
-   Revisar logs del servicio
-   Comprobar formato de archivo

### Progress no actualiza

-   Verificar conexión WebSocket
-   Comprobar autenticación JWT
-   Revisar logs de gateway

---

## 📝 Próximas Mejoras

-   [ ] Soporte para más formatos (PDF, Office docs)
-   [ ] Compresión de videos más eficiente
-   [ ] CDN integration
-   [ ] Backup automático
-   [ ] Métricas de uso
-   [ ] Rate limiting por usuario
