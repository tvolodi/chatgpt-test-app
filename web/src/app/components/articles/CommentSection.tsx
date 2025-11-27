"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

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
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);

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
            setShowLoginMessage(true);
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
                setShowLoginMessage(true);
                return;
            }

            if (res.ok) {
                const comment = await res.json();
                setComments([comment, ...comments]);
                setNewComment("");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-bold mb-4">Comments</h3>

            {status === 'loading' ? (
                <div className="mb-8 p-4 text-center text-gray-500">Loading...</div>
            ) : (
                <div className="mb-8">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onFocus={() => status !== 'authenticated' && setShowLoginMessage(true)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add a comment..."
                            rows={3}
                            disabled={loading}
                        />
                        <div className="mt-2 flex justify-between items-center">
                            {showLoginMessage && (
                                <p className="text-sm text-red-500">
                                    Please <Link href="/api/auth/signin" className="underline">sign in</Link> to leave a comment.
                                </p>
                            )}
                            <div className="flex-grow"></div>
                            <button
                                type="submit"
                                disabled={loading || !newComment.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">U</span>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900">User {comment.user_id.slice(0, 8)}</span>
                                    <span className="text-sm text-gray-500">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-gray-700">{comment.body}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No comments yet.</p>
                )}
            </div>
        </div>
    );
}
