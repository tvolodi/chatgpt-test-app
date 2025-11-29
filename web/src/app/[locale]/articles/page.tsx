"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import ArticleCard from '../../components/articles/ArticleCard';
import ArticleDetail from '../../components/articles/ArticleDetail';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryFilter from '../../components/articles/filters/CategoryFilter';
import TagFilter from '../../components/articles/filters/TagFilter';
import ActiveFilters from '../../components/articles/filters/ActiveFilters';
import { useTranslations } from 'next-intl';
import { getErrorMessage, isApiError } from '../../lib/apiTypes';

interface Article {
    id: string;
    title: string;
    body: string;
    author_id: string;
    published_at?: string;
    tags?: string[];
}

function ArticlesPageContent() {
    const t = useTranslations('Articles');
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const page = Number(searchParams.get('page')) || 1;
    const selectedId = searchParams.get('id');
    const selectedSlug = searchParams.get('slug');
    const selectedIdentifier = selectedId || selectedSlug; // Use either id or slug
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
    const [error, setError] = useState<string | null>(null);

    // Fetch categories for name lookup
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.categories || []))
            .catch(err => {
                console.error('Failed to fetch categories:', err);
                setError(getErrorMessage(err));
            });
    }, []);

    // Fetch list
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.set('page', page.toString());
                params.set('limit', limit.toString());
                if (categoryId) params.set('category_id', categoryId);
                tags.forEach(tag => params.append('tags', tag));

                const res = await fetch(`/api/articles/public?${params.toString()}`);
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
                    throw new Error(errorData.message || `Failed to fetch articles (${res.status})`);
                }
                const data = await res.json();
                setArticles(data.articles || []);
                setTotal(data.total || 0);
            } catch (err) {
                console.error('Failed to fetch articles:', err);
                setError(getErrorMessage(err));
                setArticles([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [page, categoryId, JSON.stringify(tags)]); // Add dependencies

    // Fetch selected article details
    useEffect(() => {
        if (!selectedIdentifier) {
            setSelectedArticle(null);
            return;
        }

        const fetchDetail = async () => {
            setLoadingDetail(true);
            setError(null);
            try {
                // Use different endpoint based on whether we have id or slug
                const endpoint = selectedId ? `/api/articles/${selectedId}` : `/api/articles-by-slug/${selectedSlug}`;
                const res = await fetch(endpoint);
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
                    throw new Error(errorData.message || `Failed to fetch article (${res.status})`);
                }
                const data = await res.json();
                setSelectedArticle(data.article);
            } catch (err) {
                console.error('Failed to fetch article detail:', err);
                setError(getErrorMessage(err));
                setSelectedArticle(null);
            } finally {
                setLoadingDetail(false);
            }
        };

        fetchDetail();
    }, [selectedIdentifier]);

    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/${locale}/articles?${params.toString()}`);
    };

    const handleSelectArticle = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('id', id);
        router.push(`/${locale}/articles?${params.toString()}`);
    };

    const handleCategorySelect = (id: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id) params.set('category_id', id);
        else params.delete('category_id');
        params.set('page', '1');
        router.push(`/${locale}/articles?${params.toString()}`);
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
        router.push(`/${locale}/articles?${params.toString()}`);
    };

    const handleClearAll = () => {
        router.push(`/${locale}/articles`);
        setShowFilters(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-retro-cream">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Master List Panel */}
                    <div className={`lg:w-1/3 w-full ${selectedIdentifier ? 'hidden lg:block' : 'block'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-walnut-800 font-retro">{t('Articles')}</h1>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden px-3 py-1.5 border-2 border-walnut-400 rounded-retro text-sm font-medium text-walnut-700 hover:bg-walnut-100 font-retro-sans"
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
                                    <div key={i} className="h-24 bg-walnut-200 rounded-retro"></div>
                                ))}
                            </div>
                        ) : articles.length === 0 ? (
                            <div className="text-center py-12 bg-walnut-100 rounded-retro border-2 border-walnut-300">
                                <p className="text-walnut-500 mb-2 font-retro-sans">{t('No articles found')}</p>
                                <button
                                    onClick={handleClearAll}
                                    className="text-retro-orange hover:text-retro-rust text-sm font-medium font-retro-sans"
                                >
                                    {t('Clear all filters')}
                                </button>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 bg-walnut-100 rounded-retro border-2 border-retro-rust">
                                <p className="text-retro-rust mb-2 font-retro-sans">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-retro-rust hover:text-walnut-800 text-sm font-medium underline font-retro-sans"
                                >
                                    {t('Try again')}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {articles.map((article) => (
                                    <div
                                        key={article.id}
                                        onClick={() => handleSelectArticle(article.id)}
                                        className={`cursor-pointer transition-all duration-200 p-2 rounded-retro border-2 ${selectedIdentifier === article.id
                                            ? 'ring-2 ring-walnut-500 transform scale-[1.02] bg-walnut-100 border-walnut-400 shadow-retro'
                                            : 'hover:bg-walnut-50 border-walnut-200'
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
                                    className="px-3 py-1 border-2 border-walnut-400 rounded-retro disabled:opacity-50 hover:bg-walnut-100 text-sm text-walnut-700 font-retro-sans"
                                >
                                    {t('Prev')}
                                </button>
                                <span className="px-3 py-1 text-walnut-600 text-sm font-retro-sans">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="px-3 py-1 border-2 border-walnut-400 rounded-retro disabled:opacity-50 hover:bg-walnut-100 text-sm text-walnut-700 font-retro-sans"
                                >
                                    {t('Next')}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Detail Panel */}
                    <div className={`lg:w-2/3 w-full ${!selectedIdentifier ? 'hidden lg:block' : 'block'}`}>
                        {selectedIdentifier ? (
                            loadingDetail ? (
                                <div className="h-96 bg-walnut-100 rounded-retro border-2 border-walnut-300 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-walnut-600"></div>
                                </div>
                            ) : selectedArticle ? (
                                <div>
                                    <button
                                        onClick={() => router.push(`/${locale}/articles`)}
                                        className="lg:hidden mb-4 text-retro-orange flex items-center font-retro-sans"
                                    >
                                        ← {t('Back to List')}
                                    </button>
                                    <ArticleDetail article={selectedArticle} />
                                </div>
                            ) : (
                                <div className="h-96 bg-walnut-100 rounded-retro border-2 border-walnut-300 flex items-center justify-center text-walnut-500 font-retro-sans">
                                    {t('Article not found')}
                                </div>
                            )
                        ) : (
                            <div className="h-full bg-walnut-100 rounded-retro border-2 border-walnut-300 flex items-center justify-center text-walnut-400 min-h-[500px]">
                                <p className="text-lg font-retro-sans">{t('Select an article to read')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function ArticlesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col bg-retro-cream">
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-walnut-600"></div>
                </div>
            </div>
        }>
            <ArticlesPageContent />
        </Suspense>
    );
}
