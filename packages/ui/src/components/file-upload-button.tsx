'use client';

import { Upload } from 'lucide-react';
import { useState } from 'react';
import { Button, ButtonProps } from './button';
import { FileUploadDialog, FileUploadDialogProps } from './file-upload-dialog';

export interface FileUploadButtonProps
    extends Omit<FileUploadDialogProps, 'open' | 'onOpenChange'> {
    buttonLabel?: string;
    buttonVariant?: ButtonProps['variant'];
    buttonSize?: ButtonProps['size'];
    buttonClassName?: string;
}

export function FileUploadButton({
    buttonLabel = 'Upload Files',
    buttonVariant = 'default',
    buttonSize = 'default',
    buttonClassName,
    onComplete,
    ...dialogProps
}: FileUploadButtonProps) {
    const [open, setOpen] = useState(false);

    const handleComplete = () => {
        onComplete?.();
        setOpen(false);
    };

    return (
        <>
            <Button
                variant={buttonVariant}
                size={buttonSize}
                className={buttonClassName}
                onClick={() => setOpen(true)}
            >
                <Upload className="mr-2 h-4 w-4" />
                {buttonLabel}
            </Button>

            <FileUploadDialog
                {...dialogProps}
                open={open}
                onOpenChange={setOpen}
                onComplete={handleComplete}
            />
        </>
    );
}
