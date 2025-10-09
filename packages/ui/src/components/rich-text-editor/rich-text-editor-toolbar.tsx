'use client';

import { Icon } from '@iconify/react';
import { type Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button';
import { Separator } from '../separator';

interface RichTextEditorToolbarProps {
    editor: Editor;
}

export function RichTextEditorToolbar({ editor }: RichTextEditorToolbarProps) {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt('Image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        icon,
        label,
    }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        icon: string;
        label: string;
    }) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn('h-8 w-8 p-0', isActive && 'bg-muted')}
            title={label}
        >
            <Icon icon={icon} className="h-4 w-4" />
        </Button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                icon="lucide:bold"
                label="Bold"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                icon="lucide:italic"
                label="Italic"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                icon="lucide:underline"
                label="Underline"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                icon="lucide:strikethrough"
                label="Strikethrough"
            />

            <Separator orientation="vertical" className="mx-1 h-6" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                icon="lucide:heading-1"
                label="Heading 1"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                icon="lucide:heading-2"
                label="Heading 2"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                icon="lucide:heading-3"
                label="Heading 3"
            />

            <Separator orientation="vertical" className="mx-1 h-6" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                icon="lucide:list"
                label="Bullet List"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                icon="lucide:list-ordered"
                label="Ordered List"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                icon="lucide:code-2"
                label="Code Block"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                icon="lucide:quote"
                label="Blockquote"
            />

            <Separator orientation="vertical" className="mx-1 h-6" />

            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                icon="lucide:align-left"
                label="Align Left"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                icon="lucide:align-center"
                label="Align Center"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                icon="lucide:align-right"
                label="Align Right"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                isActive={editor.isActive({ textAlign: 'justify' })}
                icon="lucide:align-justify"
                label="Justify"
            />

            <Separator orientation="vertical" className="mx-1 h-6" />

            <ToolbarButton
                onClick={setLink}
                isActive={editor.isActive('link')}
                icon="lucide:link"
                label="Add Link"
            />
            <ToolbarButton onClick={addImage} icon="lucide:image" label="Add Image" />
            <ToolbarButton
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run()
                }
                icon="lucide:table"
                label="Insert Table"
            />

            <Separator orientation="vertical" className="mx-1 h-6" />

            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                icon="lucide:undo"
                label="Undo"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                icon="lucide:redo"
                label="Redo"
            />
        </div>
    );
}
