import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <div className="relative bg-retro-cream overflow-hidden">
            {/* Retro decorative pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(
                        45deg,
                        #8b6914 0px,
                        #8b6914 1px,
                        transparent 1px,
                        transparent 20px
                    )`
                }}></div>
            </div>
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="text-center">
                            {/* Retro badge */}
                            <div className="inline-block mb-6 px-4 py-1 bg-walnut-500 text-walnut-50 text-xs font-retro-sans uppercase tracking-widest rounded-retro shadow-retro">
                                ✦ Est. 2024 ✦
                            </div>
                            <h1 className="text-4xl tracking-tight font-bold text-walnut-800 sm:text-5xl md:text-6xl font-retro">
                                <span className="block xl:inline">Build, launch, and grow</span>{' '}
                                <span className="block text-retro-orange xl:inline italic">with AI-Dala</span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-walnut-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl font-retro-sans">
                                CMS + AI search + secure auth in one stack. Build secure, fast digital experiences with Next.js and Go.
                            </p>
                            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
                                <div>
                                    <Link
                                        href="/dashboard"
                                        className="w-full flex items-center justify-center px-8 py-3 border-2 border-walnut-700 text-base font-medium rounded-retro text-walnut-50 bg-walnut-600 hover:bg-walnut-700 shadow-retro hover:shadow-retro-hover transition-all md:py-4 md:text-lg font-retro-sans uppercase tracking-wide"
                                    >
                                        Start with AI Dala
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link
                                        href="/about"
                                        className="w-full flex items-center justify-center px-8 py-3 border-2 border-walnut-500 text-base font-medium rounded-retro text-walnut-700 bg-walnut-100 hover:bg-walnut-200 shadow-retro hover:shadow-retro-hover transition-all md:py-4 md:text-lg font-retro-sans uppercase tracking-wide"
                                    >
                                        Join AI master-class
                                    </Link>
                                </div>
                            </div>
                            {/* Retro divider */}
                            <div className="mt-12 flex justify-center items-center gap-4">
                                <div className="h-px w-16 bg-walnut-300"></div>
                                <span className="text-walnut-400 text-2xl">✦</span>
                                <div className="h-px w-16 bg-walnut-300"></div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
