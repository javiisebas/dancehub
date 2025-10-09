/**
 * QUICK START GUIDE
 * =================
 *
 * The easiest way to add file upload to your app in 3 steps:
 */

// STEP 1: Import the component
// -----------------------------
/*
import { FileUploadButton } from '@web/features/storage';
*/

// STEP 2: Add to your component
// ------------------------------
/*
<FileUploadButton
    onUploadComplete={(files) => {
        console.log('Uploaded:', files);
    }}
/>
*/

// STEP 3: That's it! ✨
// ---------------------
// The component handles everything:
// - Drag and drop
// - File validation
// - Upload progress with WebSocket
// - Image optimization
// - Video processing
// - Thumbnail generation
// - Error handling

// ADVANCED USAGE
// --------------

// Upload images only:
/*
<FileUploadButton
    buttonLabel="Upload Images"
    accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
    maxFiles={5}
    maxSize={10 * 1024 * 1024}
    showPreview={true}
    onUploadComplete={(files) => {
        files.forEach(file => {
            console.log('Image URL:', file.url);
        });
    }}
/>
*/

// Upload videos:
/*
<FileUploadButton
    buttonLabel="Upload Videos"
    accept={{ 'video/*': ['.mp4', '.webm'] }}
    maxSize={100 * 1024 * 1024}
    onUploadComplete={(files) => {
        console.log('Videos uploaded:', files);
    }}
/>
*/

// Single file upload:
/*
<FileUploadButton
    buttonLabel="Choose File"
    multiple={false}
    maxFiles={1}
    onUploadComplete={(files) => {
        const [file] = files;
        console.log('File:', file);
    }}
/>
*/

// Inline (no button):
/*
import { InlineFileUpload } from '@web/features/storage';

<InlineFileUpload
    onFilesUploaded={(files) => {
        console.log('Uploaded:', files);
    }}
/>
*/

// IMPORTANT NOTES
// ---------------
//
// 1. WebSocket connection requires user authentication
// 2. Files are uploaded to R2 (Cloudflare) storage
// 3. Images are automatically optimized
// 4. Videos are automatically processed
// 5. Thumbnails are generated for images and videos
// 6. Progress updates happen in real-time
// 7. All files are validated on both client and server
//

export {};
