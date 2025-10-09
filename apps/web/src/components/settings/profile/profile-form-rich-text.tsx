'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@web/hooks/use-toast';
import { cn } from '@web/utils';
import { Button } from '@repo/ui/components/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@repo/ui/components/form';
import { FormRichTextField } from '@repo/ui/components/form-rich-text-field';
import { Input } from '@repo/ui/components/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/ui/components/select';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, 'Username must be at least 2 characters.')
        .max(30, 'Username must not be longer than 30 characters.'),
    email: z
        .string({
            required_error: 'Please select an email to display.',
        })
        .email(),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    urls: z
        .array(
            z.object({
                value: z.string().url({ message: 'Please enter a valid URL.' }),
            }),
        )
        .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
    bio: '<p>I am a passionate dancer with years of experience in various dance styles.</p>',
    urls: [{ value: 'https://example.com' }],
};

export const ProfileFormRichText = () => {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: 'onChange',
    });

    const { fields, append } = useFieldArray({
        name: 'urls',
        control: form.control,
    });

    function onSubmit(data: ProfileFormValues) {
        toast({
            title: 'Profile Updated!',
            description: 'Your profile has been successfully updated.',
        });
        console.log('Profile data:', data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a verified email" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormRichTextField
                    name="bio"
                    control={form.control}
                    label="Bio"
                    description="Tell us about yourself. You can use rich formatting to make it stand out!"
                    placeholder="Write your bio here..."
                    minHeight="250px"
                    required
                />

                <div>
                    {fields.map((field, index) => (
                        <FormField
                            control={form.control}
                            key={field.id}
                            name={`urls.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={cn(index !== 0 && 'sr-only')}>
                                        URLs
                                    </FormLabel>
                                    <FormDescription className={cn(index !== 0 && 'sr-only')}>
                                        Add links to your website, blog, or social media profiles.
                                    </FormDescription>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => append({ value: '' })}
                    >
                        Add URL
                    </Button>
                </div>

                <Button type="submit">Update profile</Button>
            </form>
        </Form>
    );
};
