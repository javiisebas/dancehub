'use client';

import { Badge } from '@repo/ui/components/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { FileUploadButton } from '@repo/ui/components/file-upload-button';
import { useState } from 'react';

export default function UploadPage() {
    const [uploadedCount, setUploadedCount] = useState(0);

    const handleUploadComplete = () => {
        setUploadedCount((prev) => prev + 1);
    };

    return (
        <div className="container mx-auto space-y-8 py-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">File Upload</h1>
                    <p className="text-muted-foreground">
                        Upload files with real-time progress tracking
                    </p>
                </div>
                {uploadedCount > 0 && (
                    <Badge variant="secondary">{uploadedCount} uploads completed</Badge>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Any File Type</CardTitle>
                        <CardDescription>Upload any type of file up to 50MB</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FileUploadButton
                            buttonLabel="Select Files"
                            onFilesSelected={(files) => console.log('Files selected:', files)}
                            onComplete={handleUploadComplete}
                            maxFiles={10}
                            maxSize={50 * 1024 * 1024}
                            multiple={true}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Images Only</CardTitle>
                        <CardDescription>Upload images with preview</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FileUploadButton
                            buttonLabel="Upload Images"
                            onFilesSelected={(files) => console.log('Images selected:', files)}
                            onComplete={handleUploadComplete}
                            accept={{
                                'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                            }}
                            maxFiles={5}
                            maxSize={10 * 1024 * 1024}
                            multiple={true}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Videos Only</CardTitle>
                        <CardDescription>Upload videos with processing</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FileUploadButton
                            buttonLabel="Upload Videos"
                            onFilesSelected={(files) => console.log('Videos selected:', files)}
                            onComplete={handleUploadComplete}
                            accept={{
                                'video/*': ['.mp4', '.webm', '.mov', '.avi'],
                            }}
                            maxFiles={3}
                            maxSize={100 * 1024 * 1024}
                            multiple={true}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Single File</CardTitle>
                        <CardDescription>Upload a single document</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FileUploadButton
                            buttonLabel="Upload Document"
                            buttonVariant="outline"
                            onFilesSelected={(files) => console.log('Document selected:', files)}
                            onComplete={handleUploadComplete}
                            accept={{
                                'application/pdf': ['.pdf'],
                                'application/msword': ['.doc'],
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                                    ['.docx'],
                            }}
                            maxFiles={1}
                            multiple={false}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>With Metadata</CardTitle>
                        <CardDescription>Upload with custom metadata</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FileUploadButton
                            buttonLabel="Upload Files"
                            buttonVariant="secondary"
                            onFilesSelected={(files) => console.log('Files with metadata:', files)}
                            onComplete={handleUploadComplete}
                            maxFiles={5}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Public Files</CardTitle>
                        <CardDescription>Upload publicly accessible files</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FileUploadButton
                            buttonLabel="Upload Public Files"
                            onFilesSelected={(files) => console.log('Public files:', files)}
                            onComplete={handleUploadComplete}
                            maxFiles={10}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
