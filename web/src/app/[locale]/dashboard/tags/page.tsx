'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TagList from '@/app/components/tags/TagList';

interface Tag {
    id: string;
    code: string;
    name: Record<string, string>;
}

export default function TagsPage({ params }: { params: { locale: string } }) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/tags');
            if (!res.ok) throw new Error('Failed to fetch tags');
            const data = await res.json();
            setTags(data || []);
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

            // Optimistic update
            setTags(tags.filter(t => t.code !== code));
        } catch (err) {
            console.error(err);
            alert('Failed to delete tag');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
                <Link
                    href={`/${params.locale}/dashboard/tags/create`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Create Tag
                </Link>
            </div>
            <TagList tags={tags} onDelete={handleDelete} locale={params.locale} />
        </div>
    );
}
