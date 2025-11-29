import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export interface Category {
    id: string;
    code: string;
    name: Record<string, string>;
    parent_id: string | null;
    children?: Category[];
}

interface CategoryTreeProps {
    categories: Category[];
    selectedId: string | null;
    onSelect: (category: Category | null) => void;
    onCreate: (parentId: string | null) => void;
    locale: string;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ categories, selectedId, onSelect, onCreate, locale }) => {
    const t = useTranslations('categories');
    // Build tree structure from flat list
    const treeData = useMemo(() => {
        const map = new Map<string, Category>();
        const roots: Category[] = [];

        // Initialize map with shallow copies to avoid mutating props
        categories.forEach(cat => {
            map.set(cat.id, { ...cat, children: [] });
        });

        // Build hierarchy
        categories.forEach(cat => {
            const node = map.get(cat.id)!;
            if (cat.parent_id && map.has(cat.parent_id)) {
                const parent = map.get(cat.parent_id)!;
                parent.children!.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    }, [categories]);

    const renderNode = (node: Category, level: number = 0) => {
        const isSelected = node.id === selectedId;
        const displayName = node.name[locale] || node.name['en'] || node.code;

        return (
            <li key={node.id} className="select-none">
                <div
                    className={`
                        flex items-center py-2 px-3 rounded-md cursor-pointer transition-colors duration-150 mb-1
                        ${isSelected ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}
                    `}
                    style={{ marginLeft: `${level * 1.5}rem` }}
                    onClick={() => onSelect(node)}
                >
                    <span className="mr-2 text-gray-400">
                        {node.children && node.children.length > 0 ? '📂' : '📄'}
                    </span>
                    <span className="truncate">{displayName}</span>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {node.code}
                    </span>
                </div>
                {node.children && node.children.length > 0 && (
                    <ul className="border-l border-gray-100 ml-4">
                        {node.children.map(child => renderNode(child, level))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-h-[500px]" data-testid="category-tree">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">{t('title')}</h3>
                <button
                    onClick={() => onCreate(selectedId)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    + {t('newCategory')}
                </button>
            </div>

            {treeData.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                    {t('noCategoriesFound')}
                </div>
            ) : (
                <ul className="space-y-1">
                    {treeData.map(node => renderNode(node))}
                </ul>
            )}
        </div>
    );
};

export default CategoryTree;
