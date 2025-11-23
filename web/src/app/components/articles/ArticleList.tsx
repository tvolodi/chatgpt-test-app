'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Article {
    id: string;
    title: string;
    body: string;
    category_id?: string;
    author_id: string;
    status: string;
    published_at?: string;
    created_at: string;
    updated_at: string;
    tags: string[];
}

interface ArticleListProps {
    onDelete?: (id: string) => void;
}

export default function ArticleList({ onDelete }: ArticleListProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;

    const fetchArticles = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            params.append('page', page.toString());
            params.append('limit', limit.toString());

            const response = await fetch(`http://localhost:4000/api/articles?${params}`);
            if (!response.ok) throw new Error('Failed to fetch articles');

            const data = await response.json();
            setArticles(data.articles || []);
            setTotal(data.total || 0);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/articles/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete article');

            fetchArticles();
            if (onDelete) onDelete(id);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete article');
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(total / limit);

    if (loading && articles.length === 0) {
        return <div className="text-center py-8 text-gray-500">Loading articles...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title..."
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <Link
                            href="/dashboard/articles/new"
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-center"
                        >
                            + New Article
                        </Link>
                    </div>
                </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Published At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Updated At
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredArticles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No articles found
                                </td>
                            </tr>
                        ) : (
                            filteredArticles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{article.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${article.status === 'PUBLISHED'
                                                ? 'bg-green-100 text-green-800'
                                                : article.status === 'DRAFT'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {article.published_at
                                            ? new Date(article.published_at).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(article.updated_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                        <Link
                                            href={`/dashboard/articles/${article.id}`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
