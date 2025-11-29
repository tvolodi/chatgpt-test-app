"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleCard from '../articles/ArticleCard';

interface Article {
    id: string;
    title: string;
    slug: string;
    summary: string;
    published_at: string;
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
                    <div key={i} className="h-64 bg-walnut-200 rounded-retro"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-retro-rust text-center py-8 font-retro-sans">{error}</div>;
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-12 bg-walnut-100 rounded-retro border-2 border-walnut-300">
                <p className="text-walnut-500 font-retro-sans">No articles published yet.</p>
            </div>
        );
    }

    return (
        <section className="py-12 bg-walnut-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-walnut-800 font-retro">Latest Articles</h2>
                    <Link
                        href="/articles"
                        className="text-walnut-600 font-semibold hover:text-walnut-800 transition-colors font-retro-sans uppercase tracking-wide"
                    >
                        Show All →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Link key={article.id} href={`/articles?slug=${article.slug}`} className="block h-full">
                            <ArticleCard article={article} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
