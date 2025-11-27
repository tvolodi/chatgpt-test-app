import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="text-center">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Build, launch, and grow</span>{' '}
                                <span className="block text-indigo-600 xl:inline">with AI-Dala</span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                CMS + AI search + secure auth in one stack. Build secure, fast digital experiences with Next.js and Go.
                            </p>
                            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                                <div className="rounded-md shadow">
                                    <Link
                                        href="/dashboard"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg"
                                    >
                                        Start with AI Dala
                                    </Link>
                                </div>
                                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                                    <Link
                                        href="/about"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg border border-gray-300"
                                    >
                                        Join AI master-class
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
