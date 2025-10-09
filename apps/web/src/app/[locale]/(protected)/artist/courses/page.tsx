import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components';
import { BookOpen, Edit, Eye, Plus, Users } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockCourses = [
    {
        id: '1',
        title: 'Contemporary Dance Fundamentals',
        thumbnail: '/placeholder.jpg',
        students: 450,
        isPublished: true,
        price: 49.99,
        priceType: 'one-time',
        lessons: 24,
        revenue: 22455,
    },
    {
        id: '2',
        title: 'Hip Hop Masterclass',
        thumbnail: '/placeholder.jpg',
        students: 380,
        isPublished: true,
        price: 39.99,
        priceType: 'subscription',
        lessons: 16,
        revenue: 15196,
    },
    {
        id: '3',
        title: 'Ballet Technique (Draft)',
        thumbnail: '/placeholder.jpg',
        students: 0,
        isPublished: false,
        price: 79.99,
        priceType: 'one-time',
        lessons: 8,
        revenue: 0,
    },
];

export default function ArtistCoursesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">My Courses</h2>
                    <p className="text-muted-foreground">
                        Manage your courses, lessons, and students
                    </p>
                </div>
                <Link href="/artist/courses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Course
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockCourses.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockCourses.filter((c) => c.isPublished).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockCourses.reduce((acc, c) => acc + c.students, 0)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${mockCourses.reduce((acc, c) => acc + c.revenue, 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Courses Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockCourses.map((course) => (
                    <Card key={course.id} className="flex flex-col">
                        <div className="relative aspect-video bg-muted">
                            {!course.isPublished && (
                                <div className="absolute right-2 top-2 rounded-md bg-yellow-500 px-2 py-1 text-xs font-semibold text-white">
                                    Draft
                                </div>
                            )}
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Course Thumbnail
                            </div>
                        </div>
                        <CardHeader className="flex-1">
                            <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                            <CardDescription>
                                {course.priceType === 'subscription'
                                    ? `$${course.price}/month`
                                    : `$${course.price} one-time`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{course.students} students</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <BookOpen className="h-4 w-4" />
                                    <span>{course.lessons} lessons</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/artist/courses/${course.id}/edit`} className="flex-1">
                                    <Button variant="outline" className="w-full" size="sm">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Link href={`/courses/${course.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full" size="sm">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
