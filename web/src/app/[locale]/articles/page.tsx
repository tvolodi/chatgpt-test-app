"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ArticleCard from '../../components/articles/ArticleCard';
import ArticleDetail from '../../components/articles/ArticleDetail';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Article {
    id: string;
    title: string;
    body: string;
    author_id: string;
    published_at?: string;
    tags?: string[];
}

export default function ArticlesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = Number(searchParams.get('page')) || 1;
    const selectedId = searchParams.get('id');
    const limit = 9;

    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Fetch list
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/articles/public?page=${page}&limit=${limit}`);
                if (!res.ok) throw new Error('Failed to fetch articles');
                const data = await res.json();
                setArticles(data.articles || []);
                setTotal(data.total || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [page]);

    // Fetch selected article details
    useEffect(() => {
        if (!selectedId) {
            setSelectedArticle(null);
            return;
        }

        const fetchDetail = async () => {
            setLoadingDetail(true);
            try {
                const res = await fetch(`/api/articles/${selectedId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSelectedArticle(data.article);
                } else {
                    setSelectedArticle(null);
                }
            } catch (err) {
                console.error(err);
                setSelectedArticle(null);
            } finally {
                setLoadingDetail(false);
            }
        };

        fetchDetail();
    }, [selectedId]);

    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/articles?${params.toString()}`);
    };

    const handleSelectArticle = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('id', id);
        router.push(`/articles?${params.toString()}`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Master List Panel */}
                    <div className={`lg:w-1/3 w-full ${selectedId ? 'hidden lg:block' : 'block'}`}>
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Articles</h1>

                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {articles.map((article) => (
                                    <div
                                        key={article.id}
                                        onClick={() => handleSelectArticle(article.id)}
                                        className={`cursor-pointer transition-all duration-200 p-2 rounded-lg border ${selectedId === article.id
                                                ? 'ring-2 ring-blue-500 transform scale-[1.02] bg-blue-50 border-blue-200'
                                                : 'hover:bg-gray-50 border-gray-100'
                                            }`}
                                    >
                                        <ArticleCard article={article} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex justify-center space-x-2 mt-6">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 text-sm"
                                >
                                    Prev
                                </button>
                                <span className="px-3 py-1 text-gray-600 text-sm">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Detail Panel */}
                    <div className={`lg:w-2/3 w-full ${!selectedId ? 'hidden lg:block' : 'block'}`}>
                        {selectedId ? (
                            loadingDetail ? (
                                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : selectedArticle ? (
                                <div>
                                    <button
                                        onClick={() => router.push('/articles')}
                                        className="lg:hidden mb-4 text-blue-600 flex items-center"
                                    >
                                        ← Back to List
                                    </button>
                                    <ArticleDetail article={selectedArticle} />
                                </div>
                            ) : (
                                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                                    Article not found.
                                </div>
                            )
                        ) : (
                            <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 min-h-[500px]">
                                <p className="text-lg">Select an article to read</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
