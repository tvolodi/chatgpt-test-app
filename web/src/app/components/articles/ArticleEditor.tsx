'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Article {
    id?: string;
    title: string;
    body: string;
    category_id?: string;
    status: string;
    tags: string[];
}

interface ArticleEditorProps {
    articleId?: string;
}

export default function ArticleEditor({ articleId }: ArticleEditorProps) {
    const router = useRouter();
    const [article, setArticle] = useState<Article>({
        title: '',
        body: '',
        category_id: undefined,
        status: 'DRAFT',
        tags: [],
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchTags();
        if (articleId) {
            fetchArticle();
        }
    }, [articleId]);

    const fetchArticle = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/articles/${articleId}`);
            if (!response.ok) throw new Error('Failed to fetch article');
            const data = await response.json();
            setArticle({
                title: data.article.title,
                body: data.article.body,
                category_id: data.article.category_id,
                status: data.article.status,
                tags: data.tags || [],
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load article');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data || []);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/tags');
            if (response.ok) {
                const data = await response.json();
                setTags(data || []);
            }
        } catch (err) {
            console.error('Failed to fetch tags:', err);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const url = articleId
                ? `http://localhost:4000/api/articles/${articleId}`
                : 'http://localhost:4000/api/articles';

            const method = articleId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: article.title,
                    body: article.body,
                    category_id: article.category_id || null,
                    tag_ids: article.tags,
                }),
            });

            if (!response.ok) throw new Error('Failed to save article');

            router.push('/dashboard/articles');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!articleId) {
            alert('Please save the article first before publishing');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/api/articles/${articleId}/publish`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to publish article');

            router.push('/dashboard/articles');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to publish article');
        } finally {
            setLoading(false);
        }
    };

    const toggleTagSelection = (tagId: string) => {
        setArticle(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(id => id !== tagId)
                : [...prev.tags, tagId],
        }));
    };

    if (error) {
        return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    {articleId ? 'Edit Article' : 'New Article'}
                </h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => router.push('/dashboard/articles')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Draft'}
                    </button>
                    {articleId && article.status !== 'PUBLISHED' && (
                        <button
                            onClick={handlePublish}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            Publish
                        </button>
                    )}
                </div>
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={article.title}
                        onChange={(e) => setArticle({ ...article, title: e.target.value })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter article title..."
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        value={article.category_id || ''}
                        onChange={(e) => setArticle({ ...article, category_id: e.target.value || undefined })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">No Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name.en || cat.code}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => toggleTagSelection(tag.id)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${article.tags.includes(tag.id)
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tag.name.en || tag.code}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body Editor */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Content (Markdown) *
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            {showPreview ? 'Edit' : 'Preview'}
                        </button>
                    </div>
                    {showPreview ? (
                        <div className="prose max-w-none border border-gray-300 rounded-md p-4 min-h-[400px] bg-gray-50">
                            <div dangerouslySetInnerHTML={{ __html: article.body }} />
                        </div>
                    ) : (
                        <textarea
                            value={article.body}
                            onChange={(e) => setArticle({ ...article, body: e.target.value })}
                            rows={20}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                            placeholder="Write your article content in Markdown..."
                        />
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                        Use Markdown syntax for formatting. Images: <code>![alt](url)</code>
                    </p>
                </div>

                {/* Status Display */}
                {articleId && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>
                                Status: <span className="font-medium">{article.status}</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
