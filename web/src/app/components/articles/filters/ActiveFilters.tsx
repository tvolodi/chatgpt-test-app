import { useTranslations } from 'next-intl';

interface ActiveFiltersProps {
    selectedCategoryId: string | null;
    selectedTags: string[];
    categories: { id: string; name: string }[];
    onClearCategory: () => void;
    onRemoveTag: (tag: string) => void;
    onClearAll: () => void;
}

export default function ActiveFilters({
    selectedCategoryId,
    selectedTags,
    categories,
    onClearCategory,
    onRemoveTag,
    onClearAll,
}: ActiveFiltersProps) {
    const t = useTranslations('Articles');

    if (!selectedCategoryId && selectedTags.length === 0) return null;

    const categoryName = categories.find((c) => c.id === selectedCategoryId)?.name;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <span className="text-sm font-medium text-blue-900 mr-2">{t('Filters')}:</span>

            {selectedCategoryId && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t('Category')}: {categoryName}
                    <button
                        onClick={onClearCategory}
                        className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                    >
                        <span className="sr-only">{t('Remove category filter')}</span>
                        &times;
                    </button>
                </span>
            )}

            {selectedTags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t('Tag')}: {tag}
                    <button
                        onClick={() => onRemoveTag(tag)}
                        className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                    >
                        <span className="sr-only">{t('Remove tag filter')}</span>
                        &times;
                    </button>
                </span>
            ))}

            <button
                onClick={onClearAll}
                className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-800 underline"
            >
                {t('Clear all')}
            </button>
        </div>
    );
}
