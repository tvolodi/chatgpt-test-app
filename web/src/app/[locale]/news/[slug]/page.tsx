'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { marked } from 'marked';
import { fetchNewsItem } from '../services';
import type { NewsItem } from '../services';

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    try {
      const data = await fetchNewsItem(slug);
      if (!data) throw new Error('Article not found');
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error === 'Article not found' ? 'Article Not Found' : 'Error'}
        </h1>
        <p className="text-gray-600 mb-8">
          {error === 'Article not found'
            ? "The article you're looking for doesn't exist or has been removed."
            : error}
        </p>
        <Link href="/news" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/news" className="hover:text-indigo-600 transition-colors">
              News
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px]">{article.title}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">AI-Dala Team</p>
                <p className="text-gray-500">
                  {format(new Date(article.published_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            {/* Share buttons could go here */}
          </div>
        </header>

        <div className="prose prose-lg max-w-none prose-indigo">
          <div dangerouslySetInnerHTML={{ __html: article.bodyHtml || marked(article.body) }} />
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
