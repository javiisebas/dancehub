import {
    Button,
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
} from '@repo/ui/components';
import { Clock, Filter, Search, Star, Users } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockCourses = [
    {
        id: '1',
        title: 'Contemporary Dance Fundamentals',
        artist: 'Sarah Johnson',
        thumbnail: '/placeholder-course.jpg',
        price: 49.99,
        priceType: 'one-time',
        rating: 4.8,
        students: 1250,
        duration: '12 hours',
        level: 'Beginner',
        description: 'Master the basics of contemporary dance with professional techniques',
    },
    {
        id: '2',
        title: 'Hip Hop Choreography Masterclass',
        artist: 'Marcus Williams',
        thumbnail: '/placeholder-course.jpg',
        price: 29.99,
        priceType: 'subscription',
        rating: 4.9,
        students: 2100,
        duration: '8 hours',
        level: 'Intermediate',
        description: 'Learn advanced hip hop moves and create your own choreographies',
    },
    {
        id: '3',
        title: 'Ballet Technique & Artistry',
        artist: 'Elena Petrova',
        thumbnail: '/placeholder-course.jpg',
        price: 79.99,
        priceType: 'one-time',
        rating: 5.0,
        students: 850,
        duration: '20 hours',
        level: 'Advanced',
        description: 'Perfect your ballet technique with world-class instruction',
    },
    {
        id: '4',
        title: 'Salsa & Latin Dance',
        artist: 'Carlos Rodriguez',
        thumbnail: '/placeholder-course.jpg',
        price: 39.99,
        priceType: 'one-time',
        rating: 4.7,
        students: 1680,
        duration: '10 hours',
        level: 'Beginner',
        description: 'Feel the rhythm and master salsa, bachata, and more',
    },
    {
        id: '5',
        title: 'Jazz Dance Evolution',
        artist: 'Michelle Lee',
        thumbnail: '/placeholder-course.jpg',
        price: 24.99,
        priceType: 'subscription',
        rating: 4.6,
        students: 920,
        duration: '6 hours',
        level: 'Intermediate',
        description: 'Explore the evolution and styles of jazz dance',
    },
    {
        id: '6',
        title: 'Breaking & B-Boy Foundations',
        artist: 'DJ Flex',
        thumbnail: '/placeholder-course.jpg',
        price: 59.99,
        priceType: 'one-time',
        rating: 4.9,
        students: 1450,
        duration: '15 hours',
        level: 'Beginner',
        description: 'Learn breaking from scratch with a legendary b-boy',
    },
];

export default function MarketplacePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Page Header */}
            <div className="mb-12">
                <h1 className="mb-4 text-4xl font-bold">Discover Courses</h1>
                <p className="text-lg text-muted-foreground">
                    Explore our collection of dance courses from world-class instructors
                </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search courses, instructors, or styles..."
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            {/* Filter Chips */}
            <div className="mb-8 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm">
                    All Levels
                </Button>
                <Button variant="outline" size="sm">
                    Beginner
                </Button>
                <Button variant="outline" size="sm">
                    Intermediate
                </Button>
                <Button variant="outline" size="sm">
                    Advanced
                </Button>
                <Button variant="outline" size="sm" className="ml-4">
                    One-Time Purchase
                </Button>
                <Button variant="outline" size="sm">
                    Subscription
                </Button>
            </div>

            {/* Course Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockCourses.map((course) => (
                    <Card key={course.id} className="flex flex-col overflow-hidden">
                        <div className="relative aspect-video bg-muted">
                            <div className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                                {course.priceType === 'subscription' ? 'Subscription' : 'Lifetime'}
                            </div>
                            {/* Placeholder for course thumbnail */}
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Course Preview
                            </div>
                        </div>
                        <CardHeader className="flex-1">
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                    {course.level}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-medium">{course.rating}</span>
                                </div>
                            </div>
                            <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {course.description}
                            </CardDescription>
                            <div className="mt-2 text-sm text-muted-foreground">
                                by {course.artist}
                            </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-4 border-t pt-4">
                            <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{course.students.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{course.duration}</span>
                                </div>
                            </div>
                            <div className="flex w-full items-center justify-between">
                                <div className="text-2xl font-bold">
                                    ${course.price}
                                    {course.priceType === 'subscription' && (
                                        <span className="text-sm font-normal text-muted-foreground">
                                            /mo
                                        </span>
                                    )}
                                </div>
                                <Link href={`/courses/${course.id}`}>
                                    <Button>View Course</Button>
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
                <Button size="lg" variant="outline">
                    Load More Courses
                </Button>
            </div>
        </div>
    );
}
