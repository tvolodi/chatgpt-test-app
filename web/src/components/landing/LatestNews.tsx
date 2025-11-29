"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface NewsItem {
    id: string;
    title: string;
    slug: string;
    summary: string;
    published_at: string;
    tags?: string[];
}

export default function LatestNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/content/news?limit=3');
                if (!res.ok) throw new Error('Failed to fetch news');
                const data = await res.json();
                setNews(data.items || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load latest news');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-walnut-200 rounded-retro"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-retro-rust text-center py-8 font-retro-sans">{error}</div>;
    }

    if (news.length === 0) {
        return (
            <div className="text-center py-12 bg-walnut-100 rounded-retro border-2 border-walnut-300">
                <p className="text-walnut-500 font-retro-sans">No news available yet.</p>
            </div>
        );
    }

    return (
        <section className="py-12 bg-walnut-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-walnut-800 font-retro">AI News</h2>
                    <Link
                        href="/news"
                        className="text-walnut-600 font-semibold hover:text-walnut-800 transition-colors font-retro-sans uppercase tracking-wide"
                    >
                        Show All →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <article key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col border-2 border-walnut-300">
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-sm text-walnut-500 mb-3">
                                    {item.tags && item.tags.length > 0 && (
                                        <span className="text-retro-orange font-medium">
                                            {item.tags[0]}
                                        </span>
                                    )}
                                    <span className="mx-2">•</span>
                                    <time dateTime={item.published_at}>
                                        {format(new Date(item.published_at), 'MMMM d, yyyy')}
                                    </time>
                                </div>

                                <Link href={`/news/${item.slug}`} className="block group">
                                    <h3 className="text-xl font-bold text-walnut-800 group-hover:text-retro-orange transition-colors mb-3 font-retro">
                                        {item.title}
                                    </h3>
                                </Link>

                                <p className="text-walnut-600 mb-4 line-clamp-3 flex-1 font-retro-sans">
                                    {item.summary || 'Latest updates from the AI world...'}
                                </p>

                                <div className="mt-auto pt-4 border-t border-walnut-200">
                                    <Link
                                        href={`/news/${item.slug}`}
                                        className="text-retro-orange font-medium hover:text-retro-rust transition-colors flex items-center font-retro-sans uppercase tracking-wide text-sm"
                                    >
                                        Read more
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}