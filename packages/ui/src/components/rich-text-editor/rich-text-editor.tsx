'use client';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { all, createLowlight } from 'lowlight';
import { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { RichTextEditorToolbar } from './rich-text-editor-toolbar';

const lowlight = createLowlight(all);

interface RichTextEditorProps {
    content?: string | null;
    onChange?: (content: string) => void;
    placeholder?: string;
    editable?: boolean;
    className?: string;
    minHeight?: string;
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = 'Start writing...',
    editable = true,
    className,
    minHeight = '200px',
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full',
                },
            }),
            TableRow,
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-border p-2',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-border p-2 bg-muted font-bold',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Placeholder.configure({
                placeholder,
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-muted rounded-lg p-4 font-mono text-sm',
                },
            }),
        ],
        content: content || '',
        editable,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm sm:prose-base max-w-none focus:outline-none',
                    'prose-headings:font-bold prose-headings:text-foreground',
                    'prose-p:text-foreground prose-p:leading-relaxed',
                    'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
                    'prose-strong:text-foreground prose-strong:font-bold',
                    'prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
                    'prose-pre:bg-muted prose-pre:text-foreground',
                    'prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground',
                    'prose-ul:list-disc prose-ol:list-decimal',
                    'prose-li:text-foreground',
                    'prose-table:border-collapse',
                    'prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted',
                    'prose-td:border prose-td:border-border prose-td:p-2',
                    'px-4 py-3',
                ),
                style: `min-height: ${minHeight}`,
            },
        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
    });

    useEffect(() => {
        if (editor && content !== undefined && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editable, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div
            className={cn(
                'overflow-hidden rounded-lg border border-border bg-background',
                className,
            )}
        >
            {editable && <RichTextEditorToolbar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    );
}
