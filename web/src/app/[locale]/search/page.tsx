'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SearchBar } from '@/app/components/common/SearchBar';
import { SearchResultItem } from '@/app/components/search/SearchResultItem';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchResult {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    category_id?: string;
    published_at: string;
    tags: string[];
}

interface SearchResponse {
    articles: SearchResult[];
    total: number;
    page: number;
    limit: number;
    query: string;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<SearchResult[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations('search');

    useEffect(() => {
        if (query.length >= 2) {
            performSearch(query);
        } else {
            setResults([]);
            setTotal(0);
        }
    }, [query]);

    const performSearch = async (searchQuery: string) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                q: searchQuery,
                limit: '10',
                page: '1'
            });

            const response = await fetch(`/api/articles/search?${params}`);
            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`);
            }

            const data: SearchResponse = await response.json();
            setResults(data.articles);
            setTotal(data.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
            setResults([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-retro text-walnut-800 mb-4">
                            {t('title')}
                        </h1>

                        <div className="max-w-md">
                            <SearchBar
                                placeholder={t('placeholder')}
                                className="mb-4"
                            />
                        </div>

                        {query && (
                            <p className="text-walnut-600 font-retro-sans">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <MagnifyingGlassIcon className="h-5 w-5 animate-spin" />
                                        {t('searching')}
                                    </span>
                                ) : (
                                    t('resultsFor', { query, count: total })
                                )}
                            </p>
                        )}
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-retro-rust/10 border-2 border-retro-rust rounded-retro p-4 mb-8">
                            <p className="text-retro-rust font-retro-sans">
                                {t('error')}: {error}
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {!loading && !error && (
                        <>
                            {results.length > 0 ? (
                                <div className="space-y-6">
                                    {results.map((result) => (
                                        <SearchResultItem key={result.id} {...result} />
                                    ))}
                                </div>
                            ) : query.length >= 2 ? (
                                <div className="text-center py-12">
                                    <MagnifyingGlassIcon className="h-12 w-12 text-walnut-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-retro text-walnut-800 mb-2">
                                        {t('noResults')}
                                    </h3>
                                    <p className="text-walnut-600 font-retro-sans">
                                        {t('tryDifferentQuery')}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <MagnifyingGlassIcon className="h-12 w-12 text-walnut-400 mx-auto mb-4" />
                                    <p className="text-walnut-600 font-retro-sans">
                                        {t('enterQuery')}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-6 animate-pulse">
                                    <div className="h-6 bg-walnut-200 rounded mb-2"></div>
                                    <div className="h-4 bg-walnut-200 rounded mb-1"></div>
                                    <div className="h-4 bg-walnut-200 rounded w-3/4 mb-4"></div>
                                    <div className="flex gap-4">
                                        <div className="h-4 bg-walnut-200 rounded w-20"></div>
                                        <div className="h-4 bg-walnut-200 rounded w-16"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}