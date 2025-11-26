"use client";

import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { format } from 'date-fns';
import LikeControl from './LikeControl';
import CommentSection from './CommentSection';

interface Article {
    id: string;
    title: string;
    body: string;
    author_id: string;
    published_at?: string;
    tags?: string[];
}

interface ArticleDetailProps {
    article: Article;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
    const [htmlContent, setHtmlContent] = useState("");
    const [interactions, setInteractions] = useState({ likes: 0, dislikes: 0 });

    useEffect(() => {
        const renderMarkdown = async () => {
            const html = await marked(article.body);
            setHtmlContent(html);
        };
        renderMarkdown();
    }, [article.body]);

    useEffect(() => {
        // Fetch initial interaction counts
        const fetchInteractions = async () => {
            try {
                const res = await fetch(`/api/articles/${article.id}/interactions`);
                if (res.ok) {
                    const data = await res.json();
                    setInteractions({ likes: data.likes || 0, dislikes: data.dislikes || 0 });
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchInteractions();
    }, [article.id]);

    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

            <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By Author {article.author_id.slice(0, 8)}</span>
                    {article.published_at && (
                        <span>{format(new Date(article.published_at), 'MMM d, yyyy')}</span>
                    )}
                </div>
                <LikeControl
                    articleId={article.id}
                    initialLikes={interactions.likes}
                    initialDislikes={interactions.dislikes}
                />
            </div>

            <div
                className="prose max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {article.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <CommentSection articleId={article.id} />
        </div>
    );
}
