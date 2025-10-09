/**
 * FILE UPLOADER USAGE EXAMPLES
 *
 * This file demonstrates various ways to use the file uploader system.
 * The system includes:
 * - Real-time WebSocket progress tracking
 * - Image optimization and thumbnail generation
 * - Video processing and thumbnail generation
 * - Drag-and-drop interface
 * - Multiple file uploads
 * - File type validation
 * - Size validation
 * - Preview support
 */

// ============================================================================
// EXAMPLE 1: Simple Button Upload
// ============================================================================

/*
import { FileUploadButton } from '@web/features/storage';
import { StorageVisibilityEnum } from '@repo/shared';

function MyComponent() {
    const handleUploadComplete = (files) => {
        console.log('Uploaded files:', files);
    };

    return (
        <FileUploadButton
            buttonLabel="Upload Files"
            maxFiles={10}
            maxSize={50 * 1024 * 1024} // 50MB
            visibility={StorageVisibilityEnum.PRIVATE}
            onUploadComplete={handleUploadComplete}
        />
    );
}
*/

// ============================================================================
// EXAMPLE 2: Image Upload with Preview
// ============================================================================

/*
import { FileUploadButton } from '@web/features/storage';
import { StorageVisibilityEnum } from '@repo/shared';

function ImageUploader() {
    return (
        <FileUploadButton
            buttonLabel="Upload Images"
            title="Upload Images"
            description="Select images to upload (PNG, JPG, WebP)"
            accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            }}
            maxFiles={5}
            maxSize={10 * 1024 * 1024} // 10MB
            visibility={StorageVisibilityEnum.PUBLIC}
            showPreview={true}
            onUploadComplete={(files) => {
                console.log('Uploaded images:', files);
            }}
        />
    );
}
*/

// ============================================================================
// EXAMPLE 3: Video Upload
// ============================================================================

/*
import { FileUploadButton } from '@web/features/storage';
import { StorageVisibilityEnum } from '@repo/shared';

function VideoUploader() {
    return (
        <FileUploadButton
            buttonLabel="Upload Videos"
            title="Upload Videos"
            description="Select videos (MP4, WebM, MOV)"
            accept={{
                'video/*': ['.mp4', '.webm', '.mov', '.avi'],
            }}
            maxFiles={3}
            maxSize={100 * 1024 * 1024} // 100MB
            visibility={StorageVisibilityEnum.PUBLIC}
            onUploadComplete={(files) => {
                console.log('Uploaded videos:', files);
            }}
        />
    );
}
*/

// ============================================================================
// EXAMPLE 4: Custom Dialog with Advanced Control
// ============================================================================

/*
import { useState } from 'react';
import { FileUploadDialog } from '@web/features/storage';
import { Button } from '@repo/ui/components/button';
import { StorageVisibilityEnum } from '@repo/shared';

function AdvancedUploader() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                Open Upload Dialog
            </Button>

            <FileUploadDialog
                open={open}
                onOpenChange={setOpen}
                title="Upload Files"
                description="Select files to upload"
                maxFiles={10}
                maxSize={50 * 1024 * 1024}
                visibility={StorageVisibilityEnum.PRIVATE}
                metadata={{
                    source: 'advanced-uploader',
                    timestamp: Date.now(),
                }}
                onComplete={(files) => {
                    console.log('Upload complete:', files);
                    setOpen(false);
                }}
            />
        </>
    );
}
*/

// ============================================================================
// EXAMPLE 5: Using the Upload Hook Directly
// ============================================================================

/*
import { useFileUpload } from '@web/features/storage/hooks/use-file-upload.hook';
import { StorageVisibilityEnum } from '@repo/shared';
import { FileUploader } from '@repo/ui/components/file-uploader';

function CustomUploader() {
    const {
        uploadFile,
        uploadFiles,
        uploads,
        isUploading,
        isConnected,
        clearUpload,
    } = useFileUpload({
        visibility: StorageVisibilityEnum.PRIVATE,
        metadata: { category: 'custom' },
        onSuccess: (result) => {
            console.log('File uploaded:', result);
        },
        onError: (error) => {
            console.error('Upload error:', error);
        },
    });

    const fileItems = uploads.map((upload) => ({
        id: upload.uploadId,
        file: upload.file,
        preview: upload.file.type.startsWith('image/')
            ? URL.createObjectURL(upload.file)
            : undefined,
        progress: upload.progress,
        status: upload.status,
        message: upload.message,
        error: upload.error,
    }));

    return (
        <div>
            <FileUploader
                onFilesSelected={uploadFiles}
                files={fileItems}
                maxFiles={10}
                maxSize={50 * 1024 * 1024}
                disabled={isUploading}
            />

            {!isConnected && (
                <p>WebSocket disconnected - uploads will continue without real-time updates</p>
            )}
        </div>
    );
}
*/

// ============================================================================
// EXAMPLE 6: Single File Upload with Validation
// ============================================================================

/*
import { FileUploadButton } from '@web/features/storage';
import { StorageVisibilityEnum } from '@repo/shared';

function DocumentUploader() {
    return (
        <FileUploadButton
            buttonLabel="Upload Document"
            buttonVariant="outline"
            title="Upload Document"
            description="Select a PDF, DOC, or DOCX file"
            accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            }}
            maxFiles={1}
            multiple={false}
            maxSize={5 * 1024 * 1024} // 5MB
            visibility={StorageVisibilityEnum.PRIVATE}
            showPreview={false}
            onUploadComplete={(files) => {
                const [file] = files;
                console.log('Document uploaded:', file);
            }}
        />
    );
}
*/

// ============================================================================
// EXAMPLE 7: Profile Picture Upload
// ============================================================================

/*
import { FileUploadButton } from '@web/features/storage';
import { StorageVisibilityEnum } from '@repo/shared';

function ProfilePictureUpload({ userId }: { userId: string }) {
    return (
        <FileUploadButton
            buttonLabel="Change Profile Picture"
            buttonSize="sm"
            title="Upload Profile Picture"
            description="Select a profile picture (max 2MB)"
            accept={{
                'image/*': ['.png', '.jpg', '.jpeg'],
            }}
            maxFiles={1}
            multiple={false}
            maxSize={2 * 1024 * 1024} // 2MB
            visibility={StorageVisibilityEnum.PUBLIC}
            showPreview={true}
            metadata={{
                type: 'profile-picture',
                userId,
            }}
            onUploadComplete={(files) => {
                const [file] = files;
                console.log('Profile picture updated:', file.url);
            }}
        />
    );
}
*/

// ============================================================================
// FEATURES
// ============================================================================

/**
 * WebSocket Progress Tracking:
 * - Real-time upload progress
 * - Image/video processing status
 * - Thumbnail generation updates
 * - Error notifications
 *
 * Image Optimization:
 * - Automatic format conversion
 * - Size optimization
 * - Thumbnail generation (small, medium, large)
 * - Maintains aspect ratio
 *
 * Video Processing:
 * - Format optimization
 * - Compression
 * - Video thumbnails
 * - Metadata extraction (duration, dimensions, codec, etc.)
 *
 * Validation:
 * - File type validation
 * - File size validation
 * - Custom validators
 * - User-friendly error messages
 *
 * Storage:
 * - R2 (Cloudflare) integration
 * - Public/private visibility
 * - Custom metadata support
 * - Presigned URLs for private files
 */

export {};
