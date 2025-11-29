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
        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-walnut-100 border-2 border-walnut-400 rounded-retro">
            <span className="text-sm font-medium text-walnut-800 mr-2 font-retro-sans">{t('Filters')}:</span>

            {selectedCategoryId && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-retro text-xs font-medium bg-walnut-200 text-walnut-700 border border-walnut-400 font-retro-sans">
                    {t('Category')}: {categoryName}
                    <button
                        onClick={onClearCategory}
                        className="ml-1.5 inline-flex text-walnut-500 hover:text-walnut-700 focus:outline-none"
                    >
                        <span className="sr-only">{t('Remove category filter')}</span>
                        &times;
                    </button>
                </span>
            )}

            {selectedTags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-retro text-xs font-medium bg-walnut-200 text-walnut-700 border border-walnut-400 font-retro-sans">
                    {t('Tag')}: {tag}
                    <button
                        onClick={() => onRemoveTag(tag)}
                        className="ml-1.5 inline-flex text-walnut-500 hover:text-walnut-700 focus:outline-none"
                    >
                        <span className="sr-only">{t('Remove tag filter')}</span>
                        &times;
                    </button>
                </span>
            ))}

            <button
                onClick={onClearAll}
                className="ml-auto text-xs font-medium text-retro-orange hover:text-retro-rust underline font-retro-sans"
            >
                {t('Clear all')}
            </button>
        </div>
    );
}
