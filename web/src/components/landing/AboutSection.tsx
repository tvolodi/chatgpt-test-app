import Link from 'next/link';

export default function AboutSection() {
    return (
        <div className="bg-walnut-700">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-walnut-50 sm:text-4xl font-retro">
                    <span className="block">Ready to dive in?</span>
                    <span className="block text-retro-mustard">Start building with AI-Dala today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-walnut-200 font-retro-sans">
                    AI-Dala is an open-source project created by Volodymyr to demonstrate modern web development practices with AI integration.
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-5 py-3 border-2 border-walnut-500 text-base font-medium rounded-retro text-walnut-700 bg-walnut-50 hover:bg-walnut-100 shadow-retro hover:shadow-retro-hover transition-all font-retro-sans uppercase tracking-wide"
                        >
                            Contact Us
                        </Link>
                    </div>
                    <div className="ml-3 inline-flex">
                        <Link
                            href="https://t.me/ai_dala"
                            target="_blank"
                            className="inline-flex items-center justify-center px-5 py-3 border-2 border-walnut-900 text-base font-medium rounded-retro text-walnut-50 bg-walnut-800 hover:bg-walnut-900 shadow-retro hover:shadow-retro-hover transition-all font-retro-sans uppercase tracking-wide"
                        >
                            Join Telegram
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
