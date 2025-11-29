"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
    const { status } = useSession();
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
        <div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-8">
            <h1 className="text-3xl font-bold text-walnut-800 mb-4 font-retro">{article.title}</h1>

            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-walnut-200">
                <div className="flex items-center space-x-4 text-sm text-walnut-500 font-retro-sans">
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
                className="prose prose-walnut max-w-none mb-12 font-retro-sans"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {article.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-walnut-200 text-walnut-700 rounded-retro text-sm border border-walnut-400 font-retro-sans">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {status !== 'authenticated' && status !== 'loading' && (
                <div className="mb-6 p-4 bg-walnut-100 border-2 border-walnut-400 rounded-retro">
                    <p className="text-sm text-walnut-700 font-retro-sans">
                        <Link href="/api/auth/signin" className="font-medium underline hover:text-walnut-900 text-retro-orange">
                            Sign in
                        </Link>
                        {' '}to leave comments and like this article.
                    </p>
                </div>
            )}

            <CommentSection articleId={article.id} />
        </div>
    );
}
