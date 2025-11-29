'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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
    const { data: session } = useSession();
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
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
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
        return <div className="text-center py-8 text-walnut-500 font-retro-sans">Loading articles...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-retro-rust font-retro-sans">Error: {error}</div>;
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-walnut-700 mb-1 font-retro-sans uppercase tracking-wide">Search</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title..."
                            className="block w-full border-2 border-walnut-300 rounded-retro shadow-sm focus:ring-walnut-500 focus:border-walnut-500 bg-walnut-50 font-retro-sans"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-walnut-700 mb-1 font-retro-sans uppercase tracking-wide">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="block w-full border-2 border-walnut-300 rounded-retro shadow-sm focus:ring-walnut-500 focus:border-walnut-500 bg-walnut-50 font-retro-sans"
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
                            className="w-full px-4 py-2 bg-walnut-600 text-walnut-50 rounded-retro hover:bg-walnut-700 transition-colors text-center border-2 border-walnut-700 shadow-retro hover:shadow-retro-hover font-retro-sans uppercase tracking-wide"
                        >
                            + New Article
                        </Link>
                    </div>
                </div>
            </div>

            {/* Articles Table */}
            <div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 overflow-hidden">
                <table className="min-w-full divide-y divide-walnut-300">
                    <thead className="bg-walnut-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-walnut-700 uppercase tracking-wider font-retro-sans">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-walnut-700 uppercase tracking-wider font-retro-sans">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-walnut-700 uppercase tracking-wider font-retro-sans">
                                Published At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-walnut-700 uppercase tracking-wider font-retro-sans">
                                Updated At
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-walnut-700 uppercase tracking-wider font-retro-sans">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-walnut-50 divide-y divide-walnut-200">
                        {filteredArticles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-walnut-500 font-retro-sans">
                                    No articles found
                                </td>
                            </tr>
                        ) : (
                            filteredArticles.map((article) => (
                                <tr key={article.id} className="hover:bg-walnut-100 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-walnut-800 font-retro">{article.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-retro text-xs font-medium border ${article.status === 'PUBLISHED'
                                                ? 'bg-retro-olive/20 text-retro-olive border-retro-olive'
                                                : article.status === 'DRAFT'
                                                    ? 'bg-retro-mustard/20 text-retro-rust border-retro-mustard'
                                                    : 'bg-walnut-200 text-walnut-600 border-walnut-400'
                                                } font-retro-sans uppercase`}
                                        >
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-walnut-600 font-retro-sans">
                                        {article.published_at
                                            ? new Date(article.published_at).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-walnut-600 font-retro-sans">
                                        {new Date(article.updated_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2 font-retro-sans">
                                        <Link
                                            href={`/dashboard/articles/${article.id}`}
                                            className="text-walnut-600 hover:text-walnut-800 uppercase tracking-wide"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="text-retro-rust hover:text-retro-orange uppercase tracking-wide"
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
                        className="px-3 py-1 border-2 border-walnut-500 rounded-retro disabled:opacity-50 disabled:cursor-not-allowed hover:bg-walnut-100 bg-walnut-50 text-walnut-700 font-retro-sans uppercase tracking-wide text-sm"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-walnut-700 font-retro-sans">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border-2 border-walnut-500 rounded-retro disabled:opacity-50 disabled:cursor-not-allowed hover:bg-walnut-100 bg-walnut-50 text-walnut-700 font-retro-sans uppercase tracking-wide text-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
