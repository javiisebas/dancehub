'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RichTextEditor, RichTextRenderer } from '@repo/ui/components';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Form } from '@repo/ui/components/form';
import { FormRichTextField } from '@repo/ui/components/form-rich-text-field';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    content: z.string().min(10, 'Content must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export function RichTextDemo() {
    const [savedContent, setSavedContent] = useState<string>('');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: '',
        },
    });

    const onSubmit = (data: FormValues) => {
        setSavedContent(data.content);
        console.log('Form submitted:', data);
    };

    return (
        <div className="container mx-auto max-w-4xl space-y-8 py-8">
            <div>
                <h1 className="mb-2 text-3xl font-bold">Rich Text Editor Demo</h1>
                <p className="text-muted-foreground">
                    Example of Tiptap editor integration with react-hook-form
                </p>
            </div>

            <Card className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormRichTextField
                            name="content"
                            control={form.control}
                            label="Content"
                            description="Create rich content with formatting, images, tables, and more"
                            placeholder="Start writing your content here..."
                            minHeight="300px"
                            required
                        />

                        <div className="flex gap-4">
                            <Button type="submit">Save Content</Button>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Reset
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>

            {savedContent && (
                <Card className="p-6">
                    <h2 className="mb-4 text-2xl font-bold">Rendered Content</h2>
                    <RichTextRenderer content={savedContent} />
                </Card>
            )}

            <Card className="p-6">
                <h2 className="mb-4 text-xl font-bold">Standalone Editor Example</h2>
                <RichTextEditor
                    content="<h2>Welcome to the Rich Text Editor</h2><p>This is a <strong>powerful</strong> editor with many features:</p><ul><li>Text formatting</li><li>Lists and tables</li><li>Code blocks</li><li>And much more!</li></ul>"
                    onChange={(content) => console.log('Content changed:', content)}
                    placeholder="Start writing..."
                    minHeight="200px"
                />
            </Card>
        </div>
    );
}
