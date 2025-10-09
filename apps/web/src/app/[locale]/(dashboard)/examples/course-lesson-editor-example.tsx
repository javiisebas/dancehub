'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@web/hooks/use-toast';
import { RichTextRenderer } from '@repo/ui/components';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@repo/ui/components/form';
import { FormRichTextField } from '@repo/ui/components/form-rich-text-field';
import { Input } from '@repo/ui/components/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const lessonFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    content: z.string().min(50, 'Lesson content must be at least 50 characters'),
    objectives: z.string().min(20, 'Learning objectives are required'),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

const defaultContent = `
<h2>Introduction to Salsa Basic Steps</h2>
<p>In this lesson, you'll learn the fundamental steps of Salsa dancing. These steps form the foundation for all Salsa patterns.</p>

<h3>What You'll Learn</h3>
<ul>
  <li>Basic forward and backward steps</li>
  <li>Timing and rhythm (1-2-3, 5-6-7)</li>
  <li>Weight transfer techniques</li>
  <li>Body movement and styling</li>
</ul>

<h3>Step-by-Step Instructions</h3>
<ol>
  <li><strong>Starting Position</strong>: Stand with feet together, weight evenly distributed</li>
  <li><strong>Count 1</strong>: Step forward with left foot</li>
  <li><strong>Count 2</strong>: Weight shift to right foot in place</li>
  <li><strong>Count 3</strong>: Step left foot back to starting position</li>
</ol>

<blockquote>
  <p><strong>Pro Tip:</strong> Focus on maintaining a steady rhythm before adding styling. The foundation must be solid!</p>
</blockquote>

<h3>Practice Tips</h3>
<p>Practice these steps daily for <mark>at least 15 minutes</mark> to build muscle memory. Use a metronome or Salsa music to maintain consistent timing.</p>
`;

export function CourseLessonEditorExample() {
    const form = useForm<LessonFormValues>({
        resolver: zodResolver(lessonFormSchema),
        defaultValues: {
            title: 'Salsa Basic Steps',
            description:
                '<p>Learn the fundamental steps of Salsa dancing in this comprehensive lesson.</p>',
            content: defaultContent,
            objectives:
                '<ul><li>Master the basic Salsa timing</li><li>Develop proper weight transfer technique</li><li>Build confidence in basic movement</li></ul>',
        },
    });

    const onSubmit = (data: LessonFormValues) => {
        toast({
            title: 'Lesson Saved!',
            description: 'Your lesson has been successfully saved.',
        });
        console.log('Lesson data:', data);
    };

    const watchedContent = form.watch('content');
    const watchedDescription = form.watch('description');
    const watchedObjectives = form.watch('objectives');

    return (
        <div className="container mx-auto max-w-7xl py-8">
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold">Create Dance Lesson</h1>
                <p className="text-muted-foreground">
                    Create comprehensive dance lessons with rich multimedia content
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="mb-4 text-xl font-semibold">Editor</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lesson Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter lesson title"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormRichTextField
                                    name="description"
                                    control={form.control}
                                    label="Short Description"
                                    description="A brief overview of the lesson"
                                    placeholder="Describe the lesson..."
                                    minHeight="150px"
                                    required
                                />

                                <FormRichTextField
                                    name="objectives"
                                    control={form.control}
                                    label="Learning Objectives"
                                    description="What will students learn in this lesson?"
                                    placeholder="List the learning objectives..."
                                    minHeight="200px"
                                    required
                                />

                                <FormRichTextField
                                    name="content"
                                    control={form.control}
                                    label="Lesson Content"
                                    description="Create detailed lesson content with formatting, images, videos, and code blocks"
                                    placeholder="Start creating your lesson content..."
                                    minHeight="400px"
                                    required
                                />

                                <div className="flex gap-4">
                                    <Button type="submit">Save Lesson</Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => form.reset()}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="sticky top-6 p-6">
                        <h2 className="mb-4 text-xl font-semibold">Preview</h2>

                        <Tabs defaultValue="content" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="objectives">Objectives</TabsTrigger>
                                <TabsTrigger value="content">Content</TabsTrigger>
                            </TabsList>

                            <TabsContent value="description" className="mt-4">
                                <div className="prose-sm">
                                    <h3 className="mb-2 font-semibold">Description Preview:</h3>
                                    <RichTextRenderer content={watchedDescription} />
                                </div>
                            </TabsContent>

                            <TabsContent value="objectives" className="mt-4">
                                <div className="prose-sm">
                                    <h3 className="mb-2 font-semibold">
                                        Learning Objectives Preview:
                                    </h3>
                                    <RichTextRenderer content={watchedObjectives} />
                                </div>
                            </TabsContent>

                            <TabsContent value="content" className="mt-4">
                                <div className="prose-sm max-h-[600px] overflow-y-auto">
                                    <h3 className="mb-2 font-semibold">Full Content Preview:</h3>
                                    <RichTextRenderer content={watchedContent} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
}
