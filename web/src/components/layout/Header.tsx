'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';

export default function Header() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <header className="bg-walnut-50 border-b-2 border-walnut-500 sticky top-0 z-50">
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
                            <span className="ml-2 text-xl font-bold text-walnut-800 font-retro tracking-wide">AI-Dala</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/about"
                                className="border-transparent text-walnut-600 hover:border-walnut-500 hover:text-walnut-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium font-retro-sans uppercase tracking-wider"
                            >
                                About
                            </Link>
                            <Link
                                href="/news"
                                className="border-transparent text-walnut-600 hover:border-walnut-500 hover:text-walnut-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium font-retro-sans uppercase tracking-wider"
                            >
                                News
                            </Link>
                            <Link
                                href="/articles"
                                className="border-transparent text-walnut-600 hover:border-walnut-500 hover:text-walnut-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium font-retro-sans uppercase tracking-wider"
                            >
                                Articles
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="mr-3">
                            <LanguageSwitcher />
                        </div>
                        {status === 'loading' ? (
                            <span className="text-walnut-400 px-3 py-2 text-sm">...</span>
                        ) : session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-walnut-600 hover:text-walnut-800 px-3 py-2 rounded-retro text-sm font-medium font-retro-sans"
                                >
                                    Dashboard
                                </Link>
                                <span className="text-walnut-700 px-3 py-2 text-sm font-medium font-retro-sans">
                                    {session.user?.email || session.user?.name || 'User'}
                                </span>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="ml-3 text-walnut-600 hover:text-walnut-800 px-3 py-2 rounded-retro text-sm font-medium font-retro-sans"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/api/auth/signin"
                                    className="text-walnut-600 hover:text-walnut-800 px-3 py-2 rounded-retro text-sm font-medium font-retro-sans"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="ml-3 inline-flex items-center px-4 py-2 border-2 border-walnut-700 text-sm font-medium rounded-retro shadow-retro text-walnut-50 bg-walnut-600 hover:bg-walnut-700 hover:shadow-retro-hover transition-all font-retro-sans uppercase tracking-wide"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
