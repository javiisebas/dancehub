'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@web/hooks/use-toast';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const eventFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    location: z.string().min(3, 'Location is required'),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventFormExample() {
    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: '',
            description: '',
            location: '',
        },
    });

    const onSubmit = (data: EventFormValues) => {
        toast({
            title: 'Event Created!',
            description: 'Your event has been successfully created.',
        });
        console.log('Event data:', data);
    };

    return (
        <div className="container mx-auto max-w-4xl py-8">
            <Card className="p-6">
                <div className="mb-6">
                    <h1 className="mb-2 text-3xl font-bold">Create Dance Event</h1>
                    <p className="text-muted-foreground">
                        Fill in the details for your dance event with rich content
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Salsa Night 2025" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormRichTextField
                            name="description"
                            control={form.control}
                            label="Event Description"
                            description="Provide a detailed description of your event. Use formatting to highlight important information!"
                            placeholder="Describe your event..."
                            minHeight="300px"
                            required
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dance Studio XYZ" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <Button type="submit">Create Event</Button>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Reset
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
