import { Button, Card, CardContent } from '@repo/ui/components';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PurchaseSuccessPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                        </div>
                    </div>
                    <h1 className="mb-4 text-2xl font-bold">Payment Successful!</h1>
                    <p className="mb-6 text-muted-foreground">
                        Congratulations! You've successfully enrolled in the course. You can now
                        start learning right away.
                    </p>
                    <div className="space-y-3">
                        <Link href={`/courses/${params.id}/learn`}>
                            <Button className="w-full" size="lg">
                                Start Learning
                            </Button>
                        </Link>
                        <Link href="/courses">
                            <Button variant="outline" className="w-full" size="lg">
                                View My Courses
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
