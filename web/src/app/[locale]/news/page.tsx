'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string; // We might want to add a summary field later, for now we can truncate body
  body: string;
  published_at: string;
  tags: string[];
}

export type Category = string;

export default function NewsListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch only published articles
        const response = await fetch('http://localhost:4000/api/articles?status=PUBLISHED');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();

        // Transform data to include tags directly in article object if needed, 
        // but our API returns { articles: [{...article, tags: []}], ... }
        setArticles(data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
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

                <Link href={`/news/${article.slug || article.id}`} className="block group">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-3">
                    {article.title}
                  </h2>
                </Link>

                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                  {/* Simple strip markdown for summary - in real app use a proper stripper or summary field */}
                  {article.body.replace(/[#*`]/g, '').substring(0, 150)}...
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link
                    href={`/news/${article.slug || article.id}`}
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

        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No news articles found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
