import Link from 'next/link';

export function LandingFooter() {
    return (
        <footer className="border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">DanceHub</h3>
                        <p className="text-sm text-muted-foreground">
                            The ultimate platform for dance education and learning.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/marketplace" className="hover:text-primary">
                                    Marketplace
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-primary">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} DanceHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
