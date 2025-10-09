'use client';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/ui/components';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CreateCoursePage() {
    const [priceType, setPriceType] = useState<'one-time' | 'subscription'>('one-time');
    const [modules, setModules] = useState<
        Array<{ id: string; name: string; description: string }>
    >([]);

    const addModule = () => {
        setModules([...modules, { id: Date.now().toString(), name: '', description: '' }]);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/artist/courses">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold">Create New Course</h2>
                    <p className="text-muted-foreground">
                        Share your expertise with students worldwide
                    </p>
                </div>
            </div>

            <form className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>General details about your course</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">Course Title *</Label>
                            <Input id="title" placeholder="e.g., Contemporary Dance Fundamentals" />
                        </div>
                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <textarea
                                id="description"
                                className="w-full rounded-md border p-3"
                                rows={4}
                                placeholder="Describe what students will learn..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="summary">Summary</Label>
                            <textarea
                                id="summary"
                                className="w-full rounded-md border p-3"
                                rows={2}
                                placeholder="A brief overview of your course"
                            />
                        </div>
                        <div>
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                                id="tags"
                                placeholder="contemporary, beginner, technique, floor work"
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="level">Level</Label>
                                <Select>
                                    <SelectTrigger id="level">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                                <Input id="thumbnail" placeholder="https://..." />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing</CardTitle>
                        <CardDescription>Set your course price and type</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="priceType">Price Type *</Label>
                                <Select
                                    value={priceType}
                                    onValueChange={(val: any) => setPriceType(val)}
                                >
                                    <SelectTrigger id="priceType">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="one-time">One-Time Payment</SelectItem>
                                        <SelectItem value="subscription">
                                            Monthly Subscription
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {priceType === 'one-time'
                                        ? 'Students pay once for lifetime access'
                                        : 'Students pay monthly while subscribed'}
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="price">
                                    Price (USD) * {priceType === 'subscription' && '/month'}
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="49.99"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Select defaultValue="usd">
                                <SelectTrigger id="currency">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                                    <SelectItem value="eur">EUR - Euro</SelectItem>
                                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Course Structure */}
                <Card>
                    <CardHeader>
                        <CardTitle>Course Structure</CardTitle>
                        <CardDescription>
                            Organize your course into modules and lessons
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {modules.length === 0 ? (
                            <div className="rounded-lg border-2 border-dashed p-8 text-center">
                                <p className="mb-4 text-sm text-muted-foreground">
                                    No modules yet. Add modules to structure your course content.
                                </p>
                                <Button onClick={addModule} variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Module
                                </Button>
                            </div>
                        ) : (
                            <>
                                {modules.map((module, index) => (
                                    <div key={module.id} className="rounded-lg border p-4">
                                        <h4 className="mb-3 font-semibold">Module {index + 1}</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <Label>Module Name</Label>
                                                <Input placeholder="e.g., Introduction & Basics" />
                                            </div>
                                            <div>
                                                <Label>Description</Label>
                                                <Input placeholder="Brief description of this module" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={addModule} variant="outline" className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Another Module
                                </Button>
                            </>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Note: You can add lessons to each module after creating the course
                        </p>
                    </CardContent>
                </Card>

                {/* Publishing */}
                <Card>
                    <CardHeader>
                        <CardTitle>Publishing</CardTitle>
                        <CardDescription>Choose whether to publish your course now</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input type="checkbox" className="h-4 w-4" />
                                <span className="text-sm">
                                    Publish course immediately (make it available to students)
                                </span>
                            </label>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            If unchecked, your course will be saved as a draft and you can publish
                            it later
                        </p>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Link href="/artist/courses">
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Create Course
                    </Button>
                </div>
            </form>
        </div>
    );
}
