import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Tag {
    name: string;
    article_count: number;
}

interface TagFilterProps {
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
}

export default function TagFilter({ selectedTags, onToggleTag }: TagFilterProps) {
    const t = useTranslations('Articles');
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetch('/api/tags?popular=true&limit=50')
            .then((res) => res.json())
            .then((data) => {
                setTags(data.tags || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch tags', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="animate-pulse h-20 bg-gray-200 rounded w-full"></div>;

    const displayedTags = showAll ? tags : tags.slice(0, 15);

    return (
        <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('Tags')}</h3>
            <div className="flex flex-wrap gap-2">
                {displayedTags.map((tag) => (
                    <button
                        key={tag.name}
                        onClick={() => onToggleTag(tag.name)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedTags.includes(tag.name)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {tag.name} <span className="opacity-75 ml-1">({tag.article_count})</span>
                    </button>
                ))}
                {!showAll && tags.length > 15 && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        + {t('Show all')}
                    </button>
                )}
            </div>
        </div>
    );
}
