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

    if (loading) return <div className="animate-pulse h-20 bg-walnut-200 rounded-retro w-full"></div>;

    const displayedTags = showAll ? tags : tags.slice(0, 15);

    return (
        <div className="mb-4">
            <h3 className="text-sm font-semibold text-walnut-500 uppercase tracking-widest mb-2 font-retro-sans">{t('Tags')}</h3>
            <div className="flex flex-wrap gap-2">
                {displayedTags.map((tag) => (
                    <button
                        key={tag.name}
                        onClick={() => onToggleTag(tag.name)}
                        className={`px-3 py-1.5 rounded-retro text-xs font-medium transition-all font-retro-sans ${selectedTags.includes(tag.name)
                                ? 'bg-walnut-500 text-walnut-50 shadow-retro border-2 border-walnut-600'
                                : 'bg-walnut-100 text-walnut-600 hover:bg-walnut-200 border-2 border-walnut-300'
                            }`}
                    >
                        {tag.name} <span className="opacity-75 ml-1">({tag.article_count})</span>
                    </button>
                ))}
                {!showAll && tags.length > 15 && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="px-3 py-1.5 rounded-retro text-xs font-medium bg-walnut-50 border-2 border-walnut-400 text-walnut-700 hover:bg-walnut-100 font-retro-sans"
                    >
                        + {t('Show all')}
                    </button>
                )}
            </div>
        </div>
    );
}
