"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ArticleCard from '../../components/articles/ArticleCard';
import ArticleDetail from '../../components/articles/ArticleDetail';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryFilter from '../../components/articles/filters/CategoryFilter';
import TagFilter from '../../components/articles/filters/TagFilter';
import ActiveFilters from '../../components/articles/filters/ActiveFilters';
import { useTranslations } from 'next-intl';

interface Article {
    id: string;
    title: string;
    body: string;
    author_id: string;
    published_at?: string;
    tags?: string[];
}

export default function ArticlesPage() {
    const t = useTranslations('Articles');
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = Number(searchParams.get('page')) || 1;
    const selectedId = searchParams.get('id');
    const categoryId = searchParams.get('category_id');
    const tags = searchParams.getAll('tags');
    const limit = 9;

    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    // Fetch categories for name lookup
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.categories || []))
            .catch(console.error);
    }, []);

    // Fetch list
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.set('page', page.toString());
                params.set('limit', limit.toString());
                if (categoryId) params.set('category_id', categoryId);
                tags.forEach(tag => params.append('tags', tag));

                const res = await fetch(`/api/articles/public?${params.toString()}`);
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
    }, [page, categoryId, JSON.stringify(tags)]); // Add dependencies

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

    const handleCategorySelect = (id: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id) params.set('category_id', id);
        else params.delete('category_id');
        params.set('page', '1');
        router.push(`/articles?${params.toString()}`);
        setShowFilters(false);
    };

    const handleTagToggle = (tag: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentTags = params.getAll('tags');
        params.delete('tags');
        if (currentTags.includes(tag)) {
            currentTags.filter(t => t !== tag).forEach(t => params.append('tags', t));
        } else {
            [...currentTags, tag].forEach(t => params.append('tags', t));
        }
        params.set('page', '1');
        router.push(`/articles?${params.toString()}`);
    };

    const handleClearAll = () => {
        router.push('/articles');
        setShowFilters(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Master List Panel */}
                    <div className={`lg:w-1/3 w-full ${selectedId ? 'hidden lg:block' : 'block'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">{t('Articles')}</h1>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden px-3 py-1.5 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                {showFilters ? t('Hide Filters') : t('Filters')}
                            </button>
                        </div>

                        {/* Filters */}
                        <div className={`${showFilters ? 'block' : 'hidden'} lg:block mb-6`}>
                            <CategoryFilter
                                selectedCategoryId={categoryId}
                                onSelect={handleCategorySelect}
                            />
                            <TagFilter
                                selectedTags={tags}
                                onToggleTag={handleTagToggle}
                            />
                            <ActiveFilters
                                selectedCategoryId={categoryId}
                                selectedTags={tags}
                                categories={categories}
                                onClearCategory={() => handleCategorySelect(null)}
                                onRemoveTag={handleTagToggle}
                                onClearAll={handleClearAll}
                            />
                        </div>

                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                                ))}
                            </div>
                        ) : articles.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-gray-500 mb-2">{t('No articles found')}</p>
                                <button
                                    onClick={handleClearAll}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    {t('Clear all filters')}
                                </button>
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
                                    {t('Prev')}
                                </button>
                                <span className="px-3 py-1 text-gray-600 text-sm">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 text-sm"
                                >
                                    {t('Next')}
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
                                        ← {t('Back to List')}
                                    </button>
                                    <ArticleDetail article={selectedArticle} />
                                </div>
                            ) : (
                                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                                    {t('Article not found')}
                                </div>
                            )
                        ) : (
                            <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 min-h-[500px]">
                                <p className="text-lg">{t('Select an article to read')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
