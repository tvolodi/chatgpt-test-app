'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import TagList from '@/app/components/tags/TagList';

interface Tag {
    id: string;
    code: string;
    name: Record<string, string>;
}

interface PaginatedTagsResponse {
    tags: Tag[];
    total: number;
    has_more: boolean;
}

export default function TagsPage({ params }: { params: { locale: string } }) {
    const t = useTranslations('tags');
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTags, setTotalTags] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 20;

    useEffect(() => {
        fetchTags();
    }, [searchTerm, currentPage]);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('limit', limit.toString());
            params.append('offset', ((currentPage - 1) * limit).toString());
            if (searchTerm) {
                params.append('search', searchTerm);
            }

            const res = await fetch(`http://localhost:4000/api/tags?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch tags');

            const data: PaginatedTagsResponse = await res.json();
            setTags(data.tags || []);
            setTotalTags(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / limit));
        } catch (err) {
            setError('Error loading tags');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (code: string) => {
        if (!confirm('Are you sure you want to delete this tag?')) return;
        try {
            const res = await fetch(`http://localhost:4000/api/tags/${code}`, { method: 'DELETE' });
            // Note: API returns 204 on success
            if (!res.ok && res.status !== 404) throw new Error('Failed to delete tag');

            // Refresh the list after deletion
            fetchTags();
        } catch (err) {
            console.error(err);
            alert('Failed to delete tag');
        }
    };

    const handleSearch = (search: string) => {
        setSearchTerm(search);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading && tags.length === 0) return (
        <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                 style={{ borderColor: '#0066FF' }}></div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2"
                        style={{ color: '#0A1929', fontSize: '32px', fontWeight: 700 }}>
                        {t('title')}
                    </h1>
                    <p className="text-gray-600"
                       style={{ color: '#6B7280' }}>
                        {t('subtitle')}
                    </p>
                </div>
                <Link
                    href={`/${params.locale}/dashboard/tags/create`}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    style={{
                        background: '#0066FF',
                        color: '#FFFFFF',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        boxShadow: '0 8px 20px rgba(0, 102, 255, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Create Tag
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                     style={{
                         background: '#FEF2F2',
                         border: '1px solid #FECACA',
                         borderRadius: '12px',
                         padding: '16px 20px',
                         color: '#DC2626'
                     }}>
                    {error}
                </div>
            )}

            <TagList
                tags={tags}
                onDelete={handleDelete}
                locale={params.locale}
                onSearch={handleSearch}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                totalTags={totalTags}
                isLoading={loading}
            />
        </div>
    );
}
