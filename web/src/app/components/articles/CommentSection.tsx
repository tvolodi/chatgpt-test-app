"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';

interface Comment {
    id: string;
    user_id: string;
    body: string;
    created_at: string;
}

interface CommentSectionProps {
    articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
    const { data: session, status } = useSession();
    const t = useTranslations('Comments');
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/articles/${articleId}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data.comments || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [articleId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status !== 'authenticated') {
            // This shouldn't happen since we only show the form to authenticated users
            return;
        }
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/articles/${articleId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify({ body: newComment })
            });

            if (res.status === 401) {
                // Token expired, user needs to re-authenticate
                window.location.href = '/login';
                return;
            }

            if (res.ok) {
                const comment = await res.json();
                setComments([comment, ...comments]);
                setNewComment("");
            } else {
                console.error('Failed to post comment:', res.status);
            }
        } catch (err) {
            console.error('Error posting comment:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 border-t-2 border-walnut-300 pt-8">
            <h3 className="text-2xl font-bold text-walnut-800 mb-6 font-retro uppercase tracking-wide">
                {t('Comments')} ({comments.length})
            </h3>

            {status === 'loading' ? (
                <div className="mb-8 p-6 bg-walnut-100 border-2 border-walnut-400 rounded-retro text-center text-walnut-600 font-retro-sans">
                    {t('LoadingComments')}
                </div>
            ) : (
                <div className="mb-8">
                    {status === 'authenticated' ? (
                        <form onSubmit={handleSubmit} className="bg-walnut-50 border-2 border-walnut-500 rounded-retro p-6 shadow-retro">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full p-4 border-2 border-walnut-300 rounded-retro shadow-sm focus:ring-walnut-500 focus:border-walnut-500 bg-walnut-50 font-retro-sans resize-none"
                                placeholder={t('ShareThoughts')}
                                rows={4}
                                disabled={loading}
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading || !newComment.trim()}
                                    className="px-6 py-3 bg-walnut-600 text-walnut-50 rounded-retro border-2 border-walnut-700 shadow-retro hover:shadow-retro-hover font-retro-sans uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? t('Posting') : t('PostComment')}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-walnut-100 border-2 border-walnut-400 rounded-retro p-6 text-center">
                            <p className="text-walnut-700 font-retro-sans mb-4">
                                {t('SignInToComment')}
                            </p>
                            <Link
                                href="/login"
                                className="inline-block px-6 py-3 bg-walnut-600 text-walnut-50 rounded-retro border-2 border-walnut-700 shadow-retro hover:shadow-retro-hover font-retro-sans uppercase tracking-wide transition-all"
                            >
                                {t('SignInToCommentButton')}
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-6">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-walnut-50 border-2 border-walnut-500 rounded-retro p-6 shadow-retro" data-testid="comment-item">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-walnut-200 border-2 border-walnut-400 rounded-retro flex items-center justify-center shadow-retro">
                                        <span className="text-walnut-600 text-lg font-retro">{t('User').charAt(0)}</span>
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-semibold text-walnut-800 font-retro-sans">
                                            {t('User')} {comment.user_id.slice(0, 8)}
                                        </span>
                                        <span className="text-sm text-walnut-500 font-retro-sans uppercase tracking-wide">
                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-walnut-700 font-retro-sans leading-relaxed whitespace-pre-wrap">
                                        {comment.body}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-walnut-100 border-2 border-walnut-400 rounded-retro p-8 text-center">
                        <p className="text-walnut-600 font-retro-sans">
                            {t('NoCommentsYet')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
