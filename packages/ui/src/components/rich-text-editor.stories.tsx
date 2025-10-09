import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RichTextEditor } from './rich-text-editor/rich-text-editor';

const meta: Meta<typeof RichTextEditor> = {
    title: 'Complex/RichTextEditor',
    component: RichTextEditor,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
    render: () => {
        const [content, setContent] = useState('');
        return (
            <div className="w-full max-w-4xl">
                <RichTextEditor content={content} onChange={setContent} placeholder="Start typing..." />
            </div>
        );
    },
};

export const WithInitialContent: Story = {
    render: () => {
        const [content, setContent] = useState(
            '<h2>Welcome to the Rich Text Editor</h2><p>This is a <strong>powerful</strong> editor with many features:</p><ul><li>Bold and italic text</li><li>Lists and headings</li><li>Code blocks</li><li>And much more!</li></ul>',
        );
        return (
            <div className="w-full max-w-4xl">
                <RichTextEditor content={content} onChange={setContent} />
            </div>
        );
    },
};

export const ReadOnly: Story = {
    args: {
        content:
            '<h2>Read-only Mode</h2><p>This editor is in <strong>read-only</strong> mode. You cannot edit the content.</p>',
        editable: false,
    },
    render: (args) => (
        <div className="w-full max-w-4xl">
            <RichTextEditor {...args} onChange={() => {}} />
        </div>
    ),
};

export const WithCustomPlaceholder: Story = {
    render: () => {
        const [content, setContent] = useState('');
        return (
            <div className="w-full max-w-4xl">
                <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write something amazing..."
                />
            </div>
        );
    },
};

export const CompactMode: Story = {
    render: () => {
        const [content, setContent] = useState('');
        return (
            <div className="w-full max-w-2xl">
                <RichTextEditor content={content} onChange={setContent} className="min-h-[200px]" />
            </div>
        );
    },
};

export const WithCodeBlock: Story = {
    render: () => {
        const [content, setContent] = useState(
            '<h3>Code Example</h3><pre><code class="language-typescript">function greet(name: string) {\n  return `Hello, ${name}!`;\n}\n\nconst message = greet("World");\nconsole.log(message);</code></pre><p>This is syntax highlighted code!</p>',
        );
        return (
            <div className="w-full max-w-4xl">
                <RichTextEditor content={content} onChange={setContent} />
            </div>
        );
    },
};

