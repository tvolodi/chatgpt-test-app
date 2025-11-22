'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TagForm from '@/app/components/tags/TagForm';

export default function CreateTagPage({ params }: { params: { locale: string } }) {
    const router = useRouter();

    const handleSubmit = async (data: { code: string; name: Record<string, string> }) => {
        try {
            const res = await fetch('http://localhost:4000/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create tag');
            router.push(`/${params.locale}/dashboard/tags`);
        } catch (error) {
            console.error('Failed to create tag:', error);
            alert('Failed to create tag');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Tag</h1>
            <TagForm onSubmit={handleSubmit} locale={params.locale} />
        </div>
    );
}
