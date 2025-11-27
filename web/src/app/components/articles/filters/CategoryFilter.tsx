import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Category {
  id: string;
  name: string;
  slug: string;
  article_count: number;
}

interface CategoryFilterProps {
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({ selectedCategoryId, onSelect }: CategoryFilterProps) {
  const t = useTranslations('Articles');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch categories', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse h-8 bg-gray-200 rounded w-full"></div>;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategoryId === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        {t('All')}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategoryId === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {category.name} <span className="opacity-75 ml-1">({category.article_count})</span>
        </button>
      ))}
    </div>
  );
}
