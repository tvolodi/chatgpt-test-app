'use client';

import React, { useState, useEffect } from 'react';
import CategoryTree, { Category } from '@/app/components/categories/CategoryTree';
import CategoryForm from '@/app/components/categories/CategoryForm';

export default function CategoriesPage({ params }: { params: { locale: string } }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/categories');
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            setCategories(data || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateOrUpdate = async (data: any) => {
        try {
            const isUpdate = !!data.id;
            const url = isUpdate
                ? `http://localhost:4000/api/categories/${data.id}`
                : 'http://localhost:4000/api/categories';

            const method = isUpdate ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Operation failed');
            }

            // Refresh list
            await fetchCategories();
            // Clear selection if created new, or keep if updated
            if (!isUpdate) setSelectedCategory(null);
            alert(isUpdate ? 'Category updated!' : 'Category created!');
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`http://localhost:4000/api/categories/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                if (res.status === 409) {
                    throw new Error('Cannot delete category with active children.');
                }
                throw new Error('Failed to delete category');
            }

            await fetchCategories();
            setSelectedCategory(null);
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleCreateNew = (parentId: string | null) => {
        setSelectedCategory({
            id: '', // Empty ID signals create mode
            code: '',
            name: { en: '', ru: '', kk: '' },
            parent_id: parentId,
            children: []
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Tree View */}
                <div className="lg:col-span-1">
                    {loading ? (
                        <div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>
                    ) : (
                        <CategoryTree
                            categories={categories}
                            selectedId={selectedCategory?.id || null}
                            onSelect={setSelectedCategory}
                            onCreate={handleCreateNew}
                            locale={params.locale}
                        />
                    )}
                </div>

                {/* Right Column: Form */}
                <div className="lg:col-span-2">
                    <CategoryForm
                        initialData={selectedCategory}
                        categories={categories}
                        onSubmit={handleCreateOrUpdate}
                        onDelete={handleDelete}
                        locale={params.locale}
                    />
                </div>
            </div>
        </div>
    );
}
