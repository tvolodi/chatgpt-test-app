'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fetchNews } from './services';
import type { NewsItem } from './services';

export type Category = 'OpenAI' | 'Tools' | 'Market' | 'AI-Dala updates';

export default function NewsListPage() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const { items, total } = await fetchNews({ page: 1, pageSize: 10, category: selectedCategory || undefined });
        setArticles(items);
        setHasMore(items.length < total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [selectedCategory]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const { items, total } = await fetchNews({ page: nextPage, pageSize: 10, category: selectedCategory || undefined });
      setArticles(prev => [...prev, ...items]);
      setPage(nextPage);
      setHasMore(articles.length + items.length < total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category: Category | null) => {
    setSelectedCategory(category);
    setPage(1);
    setArticles([]);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI News & Updates</h1>
          <p className="text-xl text-gray-600">Latest updates from the AI world and AI-Dala platform.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {(['OpenAI', 'Tools', 'Market', 'AI-Dala updates'] as Category[]).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
              {article.image && (
                <div className="aspect-video bg-gray-200">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <time dateTime={article.published_at}>
                    {format(new Date(article.published_at), 'MMMM d, yyyy')}
                  </time>
                  {article.tags && article.tags.length > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-indigo-600 font-medium">
                        {article.tags[0]}
                        {article.tags.length > 1 && ` +${article.tags.length - 1}`}
                      </span>
                    </>
                  )}
                </div>

                <Link href={`/news/${article.slug}`} className="block group">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-3">
                    {article.title}
                  </h2>
                </Link>

                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                  {article.summary || article.body.replace(/[#*`]/g, '').substring(0, 150) + '...'}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link
                    href={`/news/${article.slug}`}
                    className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center"
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

        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {articles.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            No news articles found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
