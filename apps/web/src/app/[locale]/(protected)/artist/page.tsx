import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components';
import { BookOpen, DollarSign, Settings, TrendingUp, Users } from 'lucide-react';

// Mock data - will be replaced with real API calls
const mockStats = {
    totalCourses: 5,
    publishedCourses: 3,
    totalStudents: 1250,
    totalRevenue: 12450,
    recentCourses: [
        {
            id: '1',
            title: 'Contemporary Dance Fundamentals',
            students: 450,
            revenue: 4950,
            completionRate: 78,
        },
        {
            id: '2',
            title: 'Advanced Hip Hop Techniques',
            students: 380,
            revenue: 3800,
            completionRate: 65,
        },
        {
            id: '3',
            title: 'Ballet Masterclass Series',
            students: 420,
            revenue: 3700,
            completionRate: 82,
        },
    ],
};

export default function ArtistDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold">Welcome Back!</h2>
                <p className="text-muted-foreground">
                    Here's an overview of your teaching performance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStats.totalCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            {mockStats.publishedCourses} published
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockStats.totalStudents.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Across all courses</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${mockStats.totalRevenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">75%</div>
                        <p className="text-xs text-muted-foreground">Student progress rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Course Performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                    <CardDescription>Overview of your top performing courses</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {mockStats.recentCourses.map((course) => (
                            <div key={course.id} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">{course.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {course.students} students • ${course.revenue} revenue
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium">
                                        {course.completionRate}% completion
                                    </div>
                                    <div className="mt-1 h-2 w-32 rounded-full bg-secondary">
                                        <div
                                            className="h-2 rounded-full bg-primary"
                                            style={{ width: `${course.completionRate}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks to manage your courses</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <a
                        href="/artist/courses/new"
                        className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-secondary"
                    >
                        <BookOpen className="h-8 w-8 text-primary" />
                        <div>
                            <p className="font-medium">Create New Course</p>
                            <p className="text-sm text-muted-foreground">Start teaching</p>
                        </div>
                    </a>
                    <a
                        href="/artist/students"
                        className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-secondary"
                    >
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                            <p className="font-medium">Manage Students</p>
                            <p className="text-sm text-muted-foreground">View enrollments</p>
                        </div>
                    </a>
                    <a
                        href="/artist/settings"
                        className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-secondary"
                    >
                        <Settings className="h-8 w-8 text-primary" />
                        <div>
                            <p className="font-medium">Settings</p>
                            <p className="text-sm text-muted-foreground">Configure account</p>
                        </div>
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}
