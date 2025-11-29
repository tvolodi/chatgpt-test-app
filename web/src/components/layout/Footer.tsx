import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-walnut-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="text-sm font-semibold text-walnut-400 tracking-widest uppercase font-retro-sans">Product</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link href="/features" className="text-base text-walnut-300 hover:text-walnut-50 font-retro-sans">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-base text-walnut-300 hover:text-walnut-50 font-retro-sans">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-walnut-400 tracking-widest uppercase font-retro-sans">Support</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link href="/docs" className="text-base text-walnut-300 hover:text-walnut-50 font-retro-sans">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-base text-walnut-300 hover:text-walnut-50 font-retro-sans">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-walnut-400 tracking-widest uppercase font-retro-sans">Company</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link href="/about" className="text-base text-walnut-300 hover:text-walnut-50 font-retro-sans">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-base text-walnut-300 hover:text-walnut-50 font-retro-sans">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-walnut-400 tracking-widest uppercase font-retro-sans">Legal</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link href="/privacy" className="text-base text-walnut-300 hover:text-walnut-50 font-retro-sans">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-base text-walnut-300 hover:text-walnut-50 font-retro-sans">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-walnut-600 pt-8 md:flex md:items-center md:justify-between">
                    <div className="flex space-x-6 md:order-2">
                        {/* Social links could go here */}
                    </div>
                    <p className="mt-8 text-base text-walnut-400 md:mt-0 md:order-1 font-retro-sans">
                        &copy; {new Date().getFullYear()} AI-Dala. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
