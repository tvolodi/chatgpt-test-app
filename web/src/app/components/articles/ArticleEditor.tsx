'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from './TiptapEditor';

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

const ArticleEditorSkeleton = () => (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded-md w-48"></div>
            <div className="flex space-x-2">
                <div className="h-10 bg-gray-200 rounded-md w-24"></div>
                <div className="h-10 bg-gray-200 rounded-md w-24"></div>
            </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="h-8 bg-gray-200 rounded-md w-20"></div>
                    <div className="h-8 bg-gray-200 rounded-md w-24"></div>
                    <div className="h-8 bg-gray-200 rounded-md w-16"></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
);


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
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [tagsError, setTagsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setInitialLoading(true);

            try {
                const categoriesResponse = await fetch('http://localhost:4000/api/categories');
                if (!categoriesResponse.ok) {
                    throw new Error('Failed to load categories.');
                }
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData || []);
            } catch (err) {
                setCategoryError('Failed to load categories.');
            }

            try {
                const tagsResponse = await fetch('http://localhost:4000/api/tags');
                if (!tagsResponse.ok) {
                    throw new Error('Failed to load tags.');
                }
                const tagsData = await tagsResponse.json();
                setTags(tagsData || []);
            } catch (err) {
                setTagsError('Failed to load tags.');
            }

            if (articleId) {
                try {
                    const articleResponse = await fetch(`http://localhost:4000/api/articles/${articleId}`);
                    if (!articleResponse.ok) throw new Error('Failed to fetch article');
                    const articleData = await articleResponse.json();
                    setArticle({
                        title: articleData.article.title,
                        body: articleData.article.body,
                        category_id: articleData.article.category_id,
                        status: articleData.article.status,
                        tags: articleData.tags || [],
                    });
                } catch (err) {
                    console.log('Article fetch error:', err);
                    setError(err instanceof Error ? err.message : 'Failed to load article data');
                }
            }

            setInitialLoading(false);
        };

        fetchInitialData();
    }, [articleId]);

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

    // Upload image and return URL
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('images', file);

        const response = await fetch('http://localhost:4000/api/uploads/images', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        return data.urls[0];
    };

    if (initialLoading) {
        return <ArticleEditorSkeleton />;
    }

    if (error) {
        console.log('Rendering error message:', error);
        return <div data-testid="error-message" className="text-center py-8 text-red-600">Error: {error}</div>;
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
                    <label htmlFor="article-title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        id="article-title"
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
                    {categoryError && <p className="text-sm text-red-600 mb-2">{categoryError}</p>}
                    <select
                        value={article.category_id || ''}
                        onChange={(e) => setArticle({ ...article, category_id: e.target.value || undefined })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={!!categoryError}
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
                    {tagsError && <p className="text-sm text-red-600 mb-2">{tagsError}</p>}
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
                                disabled={!!tagsError}
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
                            Content
                        </label>
                    </div>

                    <TiptapEditor
                        value={article.body}
                        onChange={(markdown) => setArticle(prev => ({ ...prev, body: markdown }))}
                        onImageUpload={uploadImage}
                    />

                    <p className="mt-1 text-sm text-gray-500">
                        Rich text editor. Paste from Word or Google Docs supported.
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
