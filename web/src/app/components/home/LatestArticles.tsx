"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleCard from '../articles/ArticleCard';

interface Article {
    id: string;
    title: string;
    body: string;
    author_id: string;
    published_at?: string;
    tags?: string[];
}

export default function LatestArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch('/api/articles/public?limit=3');
                if (!res.ok) throw new Error('Failed to fetch articles');
                const data = await res.json();
                setArticles(data.articles || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load latest articles');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-8">{error}</div>;
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No articles published yet.</p>
            </div>
        );
    }

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
                    <Link
                        href="/articles"
                        className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                    >
                        Show All →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Link key={article.id} href={`/articles?id=${article.id}`} className="block h-full">
                            <ArticleCard article={article} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
