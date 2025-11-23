'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';

export default function Header() {
    const pathname = usePathname();
    // Simple check to hide header on dashboard if needed, but usually dashboard has its own layout.
    // Assuming this header is for public pages.

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <Image
                                    className="h-8 w-auto"
                                    src="/AI-Dala-logo.png"
                                    alt="AI-Dala"
                                    width={32}
                                    height={32}
                                />
                            </Link>
                            <span className="ml-2 text-xl font-bold text-gray-900">AI-Dala</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/about"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                About
                            </Link>
                            <Link
                                href="/news"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                News
                            </Link>
                            <Link
                                href="/articles"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Articles
                            </Link>
                        </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <div className="mr-3">
                        <LanguageSwitcher />
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/dashboard"
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
