"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Article {
    id: string;
    title: string;
    body?: string; // This will be the preview text
    summary?: string; // Alternative field for preview text
    author_id?: string;
    published_at?: string;
    tags?: string[];
}

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    return (
        <div
            className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-6 hover:shadow-retro-hover transition-all cursor-pointer select-none h-full flex flex-col"
            data-testid="article-card"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-walnut-800 mb-2 line-clamp-2 font-retro">
                        {article.title}
                    </h3>
                    <div className="flex items-center text-sm text-walnut-500 space-x-4 font-retro-sans">
                        <span>{article.published_at ? format(new Date(article.published_at), 'MMM d, yyyy') : 'Draft'}</span>
                        <span>•</span>
                        <span>Author</span>
                    </div>
                </div>
                {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-end max-w-[30%]">
                        {article.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-walnut-200 text-walnut-700 text-xs rounded-retro border border-walnut-400 font-retro-sans">
                                {tag}
                            </span>
                        ))}
                        {article.tags.length > 3 && (
                            <span className="px-2 py-1 bg-walnut-100 text-walnut-400 text-xs rounded-retro font-retro-sans">
                                +{article.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <p className="text-walnut-600 text-sm leading-relaxed mb-4 line-clamp-6 flex-grow font-retro-sans">
                {article.body || article.summary}
            </p>

            <div className="text-retro-orange text-sm font-medium hover:underline mt-auto font-retro-sans uppercase tracking-wide">
                Read more →
            </div>
        </div>
    );
}
