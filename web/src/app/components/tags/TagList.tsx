import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Tag {
    id: string;
    code: string;
    name: Record<string, string>;
}

interface PaginatedTagsResponse {
    tags: Tag[];
    total: number;
    has_more: boolean;
}

interface TagListProps {
    tags: Tag[];
    onDelete: (code: string) => void;
    locale: string;
    onSearch?: (search: string) => void;
    onPageChange?: (page: number) => void;
    currentPage?: number;
    totalPages?: number;
    totalTags?: number;
    isLoading?: boolean;
}

const TagList: React.FC<TagListProps> = ({
    tags,
    onDelete,
    locale,
    onSearch,
    onPageChange,
    currentPage = 1,
    totalPages = 1,
    totalTags = 0,
    isLoading = false
}) => {
    const t = useTranslations('tags');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        }
    };

    const startItem = (currentPage - 1) * 20 + 1;
    const endItem = Math.min(currentPage * 20, totalTags);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
             style={{
                 background: '#FFFFFF',
                 borderRadius: '16px',
                 boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
                 border: '1px solid rgba(0, 0, 0, 0.05)'
             }}>
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-100">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={t('search')}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        style={{
                            borderRadius: '12px',
                            fontSize: '14px',
                            color: '#0A1929'
                        }}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider"
                                style={{ fontSize: '12px', fontWeight: 700, color: '#0A1929' }}>
                                {t('name')}
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider"
                                style={{ fontSize: '12px', fontWeight: 700, color: '#0A1929' }}>
                                {t('code')}
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-900 uppercase tracking-wider"
                                style={{ fontSize: '12px', fontWeight: 700, color: '#0A1929' }}>
                                {t('actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                                             style={{ borderColor: '#0066FF' }}></div>
                                    </div>
                                </td>
                            </tr>
                        ) : tags.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500"
                                    style={{ color: '#6B7280' }}>
                                    {t('noTagsFound')}
                                </td>
                            </tr>
                        ) : (
                            tags.map((tag) => (
                                <tr key={tag.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900"
                                             style={{ color: '#0A1929' }}>
                                            {tag.name[locale] || tag.name['en'] || Object.values(tag.name)[0] || ''}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                              style={{
                                                  background: 'linear-gradient(135deg, #0066FF 0%, #6366F1 100%)',
                                                  borderRadius: '20px',
                                                  padding: '6px 16px',
                                                  fontSize: '12px',
                                                  fontWeight: 700,
                                                  letterSpacing: '0.5px'
                                              }}>
                                            {tag.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/${locale}/dashboard/tags/edit/${tag.code}`}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                                style={{
                                                    background: '#0066FF',
                                                    color: '#FFFFFF',
                                                    padding: '8px 16px',
                                                    borderRadius: '12px',
                                                    fontWeight: 700,
                                                    boxShadow: '0 8px 20px rgba(0, 102, 255, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {t('edit')}
                                            </Link>
                                            <button
                                                onClick={() => onDelete(tag.code)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
                                                style={{
                                                    background: '#FF6B35',
                                                    color: '#FFFFFF',
                                                    padding: '8px 16px',
                                                    borderRadius: '12px',
                                                    fontWeight: 700,
                                                    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {t('delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between"
                     style={{ background: '#F8FAFC' }}>
                    <div className="text-sm text-gray-700"
                         style={{ color: '#6B7280' }}>
                        {t('showing', {
                            start: startItem,
                            end: endItem,
                            total: totalTags
                        })}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            style={{
                                borderRadius: '12px',
                                color: currentPage === 1 ? '#9CA3AF' : '#6B7280'
                            }}
                        >
                            {t('previous')}
                        </button>
                        <span className="px-3 py-2 text-sm font-medium text-gray-700"
                              style={{ color: '#0A1929' }}>
                            {t('page', { current: currentPage, total: totalPages })}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            style={{
                                borderRadius: '12px',
                                color: currentPage === totalPages ? '#9CA3AF' : '#6B7280'
                            }}
                        >
                            {t('next')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagList;
