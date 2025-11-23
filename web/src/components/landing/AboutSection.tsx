import Link from 'next/link';

export default function AboutSection() {
    return (
        <div className="bg-indigo-700">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Ready to dive in?</span>
                    <span className="block">Start building with AI-Dala today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-indigo-200">
                    AI-Dala is an open-source project created by Volodymyr to demonstrate modern web development practices with AI integration.
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex rounded-md shadow">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                        >
                            Contact Us
                        </Link>
                    </div>
                    <div className="ml-3 inline-flex">
                        <Link
                            href="https://t.me/ai_dala"
                            target="_blank"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900"
                        >
                            Join Telegram
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
