export default function FeatureSection() {
    return (
        <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        What is AI-Dala?
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        A modern platform combining the power of a headless CMS with AI capabilities.
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                        <div className="relative">
                            <dt>
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    {/* Icon */}
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Headless CMS</p>
                            </dt>
                            <dd className="mt-2 ml-16 text-base text-gray-500">
                                Manage your content with a powerful, flexible CMS backend built in Go.
                            </dd>
                        </div>

                        <div className="relative">
                            <dt>
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    {/* Icon */}
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI Search</p>
                            </dt>
                            <dd className="mt-2 ml-16 text-base text-gray-500">
                                Intelligent search capabilities powered by vector embeddings and AI.
                            </dd>
                        </div>

                        <div className="relative">
                            <dt>
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    {/* Icon */}
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Auth</p>
                            </dt>
                            <dd className="mt-2 ml-16 text-base text-gray-500">
                                Enterprise-grade authentication and authorization out of the box.
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* For Whom Section */}
                <div className="mt-20">
                    <div className="lg:text-center mb-10">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Audience</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Who is this for?
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6 text-center">
                                <h3 className="text-lg font-medium text-gray-900">Entrepreneurs</h3>
                                <p className="mt-2 text-sm text-gray-500">Launch your digital products faster with a solid foundation.</p>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6 text-center">
                                <h3 className="text-lg font-medium text-gray-900">Developers</h3>
                                <p className="mt-2 text-sm text-gray-500">Enjoy a modern stack with Next.js, Go, and clean architecture.</p>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6 text-center">
                                <h3 className="text-lg font-medium text-gray-900">Students</h3>
                                <p className="mt-2 text-sm text-gray-500">Learn how to build production-grade AI applications.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
