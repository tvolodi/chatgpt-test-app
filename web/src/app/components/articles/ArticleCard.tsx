"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Article {
    id: string;
    title: string;
    body: string; // This will be the preview text
    author_id: string;
    published_at?: string;
    tags?: string[];
}

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer select-none h-full flex flex-col"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{article.published_at ? format(new Date(article.published_at), 'MMM d, yyyy') : 'Draft'}</span>
                        <span>•</span>
                        <span>Author</span>
                    </div>
                </div>
                {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-end max-w-[30%]">
                        {article.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {tag}
                            </span>
                        ))}
                        {article.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-full">
                                +{article.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-6 flex-grow">
                {article.body}
            </p>

            <div className="text-blue-600 text-sm font-medium hover:underline mt-auto">
                Read more →
            </div>
        </div>
    );
}
