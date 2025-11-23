'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TagForm from '@/app/components/tags/TagForm';

export default function EditTagPage({ params }: { params: { locale: string; code: string } }) {
    const router = useRouter();
    const [tag, setTag] = useState<{ code: string; name: Record<string, string> } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTag = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/tags/${params.code}`);
                if (!res.ok) throw new Error('Failed to fetch tag');
                const data = await res.json();
                setTag(data);
            } catch (err) {
                setError('Error loading tag');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTag();
    }, [params.code]);

    const handleSubmit = async (data: { code: string; name: Record<string, string> }) => {
        try {
            const res = await fetch(`http://localhost:4000/api/tags/${params.code}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update tag');
            router.push(`/${params.locale}/dashboard/tags`);
        } catch (error) {
            console.error('Failed to update tag:', error);
            alert('Failed to update tag');
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!tag) return <div className="p-6">Tag not found</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Tag</h1>
            <TagForm onSubmit={handleSubmit} locale={params.locale} initialData={tag} />
        </div>
    );
}
