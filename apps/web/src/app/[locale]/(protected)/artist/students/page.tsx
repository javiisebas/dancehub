'use client';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
} from '@repo/ui/components';
import { MoreVertical, Plus, Search, UserPlus } from 'lucide-react';
import { useState } from 'react';

// Mock data
const mockStudents = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        coursesEnrolled: ['Contemporary Dance Fundamentals', 'Hip Hop Masterclass'],
        totalCourses: 2,
        joinedDate: '2024-01-15',
        status: 'active',
        progress: 65,
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        coursesEnrolled: ['Ballet Technique & Artistry'],
        totalCourses: 1,
        joinedDate: '2024-02-20',
        status: 'active',
        progress: 42,
    },
    {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        coursesEnrolled: ['Contemporary Dance Fundamentals'],
        totalCourses: 1,
        joinedDate: '2024-03-10',
        status: 'expired',
        progress: 100,
    },
];

export default function ArtistStudentsPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStudents = mockStudents.filter(
        (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold">Students</h2>
                <p className="text-muted-foreground">
                    Manage your students and their course enrollments
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStudents.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockStudents.filter((s) => s.status === 'active').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">56%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                </Button>
            </div>

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>View and manage student enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredStudents.length === 0 ? (
                            <div className="py-12 text-center text-sm text-muted-foreground">
                                No students found
                            </div>
                        ) : (
                            filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                            {student.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{student.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {student.email}
                                            </p>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {student.coursesEnrolled
                                                    .slice(0, 2)
                                                    .map((course) => (
                                                        <span
                                                            key={course}
                                                            className="rounded-full bg-secondary px-2 py-0.5 text-xs"
                                                        >
                                                            {course}
                                                        </span>
                                                    ))}
                                                {student.coursesEnrolled.length > 2 && (
                                                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                                                        +{student.coursesEnrolled.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden text-right sm:block">
                                            <div className="text-sm font-medium">
                                                {student.totalCourses} course
                                                {student.totalCourses !== 1 ? 's' : ''}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {student.progress}% avg progress
                                            </div>
                                        </div>
                                        <div className="hidden text-right sm:block">
                                            <span
                                                className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                    student.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {student.status}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Add Student Modal (Simple version) */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Add Student to Course</CardTitle>
                            <CardDescription>
                                Manually enroll a student in one of your courses
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Student Email
                                </label>
                                <Input placeholder="student@example.com" type="email" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Select Course
                                </label>
                                <select className="w-full rounded-md border p-2">
                                    <option>Contemporary Dance Fundamentals</option>
                                    <option>Hip Hop Masterclass</option>
                                    <option>Ballet Technique & Artistry</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setShowAddModal(false)}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Student
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
