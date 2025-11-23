import Link from 'next/link';
import { format } from 'date-fns';

interface Article {
    id: string;
    title: string;
    slug: string;
    body: string;
    published_at: string;
    tags: string[];
}

async function getLatestArticles() {
    try {
        const res = await fetch('http://localhost:4000/api/articles?status=PUBLISHED&limit=3', {
            next: { revalidate: 1800 } // 30 mins ISR
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.articles || [];
    } catch (e) {
        console.error('Failed to fetch articles', e);
        return [];
    }
}

// For news we might use a category filter or a separate endpoint if we had one.
// For now, let's assume news are articles with 'news' category or tag, or just reuse articles for demo.
// In a real scenario, we'd filter by category_id for 'News'.
// Let's just fetch articles again for now to demonstrate the section.

export default async function LatestContentSection() {
    const articles = await getLatestArticles();
    // In a real app, we'd fetch news separately
    const news = articles; // Placeholder: reusing articles as news for MVP demo

    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Latest Articles */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-extrabold text-gray-900">Latest Articles</h2>
                        <Link href="/articles" className="text-indigo-600 hover:text-indigo-500 font-medium">
                            View all &rarr;
                        </Link>
                    </div>
                    <div className="grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                        {articles.map((article: Article) => (
                            <div key={article.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-indigo-600">
                                            {article.tags && article.tags[0] ? article.tags[0] : 'Article'}
                                        </p>
                                        <Link href={`/articles/${article.id}`} className="block mt-2">
                                            <p className="text-xl font-semibold text-gray-900">{article.title}</p>
                                            <p className="mt-3 text-base text-gray-500 line-clamp-3">
                                                {article.body.replace(/[#*`]/g, '').substring(0, 100)}...
                                            </p>
                                        </Link>
                                    </div>
                                    <div className="mt-6 flex items-center">
                                        <div className="flex-shrink-0">
                                            <span className="sr-only">Author</span>
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                AI
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                AI-Dala Team
                                            </p>
                                            <div className="flex space-x-1 text-sm text-gray-500">
                                                <time dateTime={article.published_at}>
                                                    {format(new Date(article.published_at), 'MMM d, yyyy')}
                                                </time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {articles.length === 0 && (
                            <p className="text-gray-500 col-span-3 text-center">No articles available yet.</p>
                        )}
                    </div>
                </div>

                {/* AI News */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-extrabold text-gray-900">AI News</h2>
                        <Link href="/news" className="text-indigo-600 hover:text-indigo-500 font-medium">
                            View all &rarr;
                        </Link>
                    </div>
                    <div className="grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                        {news.map((item: Article) => (
                            <div key={item.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <Link href={`/news/${item.slug || item.id}`} className="block mt-2">
                                            <p className="text-xl font-semibold text-gray-900">{item.title}</p>
                                            <p className="mt-3 text-base text-gray-500 line-clamp-3">
                                                {item.body.replace(/[#*`]/g, '').substring(0, 100)}...
                                            </p>
                                        </Link>
                                    </div>
                                    <div className="mt-6">
                                        <div className="text-sm text-gray-500">
                                            <time dateTime={item.published_at}>
                                                {format(new Date(item.published_at), 'MMM d, yyyy')}
                                            </time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {news.length === 0 && (
                            <p className="text-gray-500 col-span-3 text-center">No news available yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
