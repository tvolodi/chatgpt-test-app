import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Category } from './CategoryTree';

interface CategoryFormProps {
    initialData?: Category | null;
    categories: Category[]; // For parent selection
    onSubmit: (data: any) => void;
    onDelete?: (id: string) => void;
    locale: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, categories, onSubmit, onDelete, locale }) => {
    const t = useTranslations('categories');
    const [code, setCode] = useState('');
    const [names, setNames] = useState<Record<string, string>>({ en: '', ru: '', kk: '' });
    const [parentId, setParentId] = useState<string>('');

    useEffect(() => {
        if (initialData) {
            setCode(initialData.code);
            setNames(initialData.name || { en: '', ru: '', kk: '' });
            setParentId(initialData.parent_id || '');
        } else {
            setCode('');
            setNames({ en: '', ru: '', kk: '' });
            setParentId('');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            id: initialData?.id,
            code,
            name: names,
            parent_id: parentId || null
        });
    };

    const handleNameChange = (lang: string, value: string) => {
        setNames((prev) => ({ ...prev, [lang]: value }));
    };

    const isEditMode = !!initialData?.id;

    // Filter out self and descendants from parent options (simple check for self for now)
    const parentOptions = categories.filter(c => c.id !== initialData?.id);

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                    {isEditMode ? t('editCategory') : t('createNewCategory')}
                </h3>
                {isEditMode && onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(initialData!.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        {t('deleteCategory')}
                    </button>
                )}
            </div>

            <div className="px-6 py-5 space-y-6">
                {/* Code Field */}
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('categoryCode')}
                    </label>
                    <input
                        type="text"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-150"
                        placeholder="e.g., software-development"
                    />
                    <p className="mt-1 text-xs text-gray-500">Unique identifier for URL (slug)</p>
                </div>

                {/* Parent Selection */}
                <div>
                    <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('parentCategory')}
                    </label>
                    <select
                        id="parent"
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-150"
                    >
                        <option value="">{t('noneRootCategory')}</option>
                        {parentOptions.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name[locale] || cat.name['en'] || cat.code}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Names Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        {t('displayNames')}
                    </label>
                    <div className="space-y-4">
                        {[
                            { lang: 'en', labelKey: 'english', flag: '🇬🇧' },
                            { lang: 'ru', labelKey: 'russian', flag: '🇷🇺' },
                            { lang: 'kk', labelKey: 'kazakh', flag: '🇰🇿' }
                        ].map(({ lang, labelKey, flag }) => (
                            <div key={lang} className="grid grid-cols-12 gap-3 items-center">
                                <div className="col-span-3 flex items-center gap-2">
                                    <span className="text-lg">{flag}</span>
                                    <label htmlFor={`name-${lang}`} className="text-sm font-medium text-gray-700">
                                        {t(labelKey)}
                                    </label>
                                </div>
                                <div className="col-span-9">
                                    <input
                                        type="text"
                                        id={`name-${lang}`}
                                        value={names[lang] || ''}
                                        onChange={(e) => handleNameChange(lang, e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-150"
                                        placeholder={`${t(labelKey)} ${t('displayNames').toLowerCase()}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => {
                        // Reset form
                        setCode('');
                        setNames({ en: '', ru: '', kk: '' });
                        setParentId('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                    {t('reset')}
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                    {isEditMode ? t('updateCategory') : t('createCategory')}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;
