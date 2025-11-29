"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon, HandThumbDownIcon as HandThumbDownSolidIcon } from '@heroicons/react/24/solid';

interface LikeDislikeButtonsProps {
    articleId: string;
    initialLikes: number;
    initialDislikes: number;
}

export default function LikeDislikeButtons({ articleId, initialLikes, initialDislikes }: LikeDislikeButtonsProps) {
    const { data: session, status } = useSession();
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userReaction, setUserReaction] = useState<boolean | null>(null); // true = like, false = dislike, null = none
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync state with props
    useEffect(() => {
        setLikes(initialLikes);
        setDislikes(initialDislikes);
    }, [initialLikes, initialDislikes]);

    const handleReaction = async (isLike: boolean) => {
        if (status !== 'authenticated') {
            setError('Please sign in to interact with this article.');
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (loading) return;

        setLoading(true);
        setError(null);

        // Optimistic update
        const previousReaction = userReaction;
        const previousLikes = likes;
        const previousDislikes = dislikes;

        if (userReaction === isLike) {
            // Remove reaction
            setUserReaction(null);
            if (isLike) setLikes(l => Math.max(0, l - 1));
            else setDislikes(d => Math.max(0, d - 1));
        } else {
            // Add or switch reaction
            setUserReaction(isLike);
            if (isLike) {
                setLikes(l => l + 1);
                if (previousReaction === false) setDislikes(d => Math.max(0, d - 1));
            } else {
                setDislikes(d => d + 1);
                if (previousReaction === true) setLikes(l => Math.max(0, l - 1));
            }
        }

        try {
            const method = userReaction === isLike ? 'DELETE' : 'POST';
            const body = method === 'POST' ? JSON.stringify({ is_like: isLike }) : undefined;

            const res = await fetch(`/api/articles/${articleId}/like`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setError('Please sign in to interact with this article.');
                } else {
                    setError('Failed to update reaction. Please try again.');
                }
                throw new Error('API error');
            }
        } catch (err) {
            // Revert optimistic update
            setUserReaction(previousReaction);
            setLikes(previousLikes);
            setDislikes(previousDislikes);
            if (!error) {
                setError('Failed to update reaction. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-3">
                {/* Like Button */}
                <button
                    onClick={() => handleReaction(true)}
                    disabled={loading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-retro border-2 transition-all duration-200 font-retro-sans text-sm uppercase tracking-wide ${
                        userReaction === true
                            ? 'bg-retro-olive text-walnut-50 border-retro-olive shadow-retro'
                            : 'bg-walnut-50 text-walnut-700 border-walnut-400 hover:bg-walnut-100 hover:border-walnut-500'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={userReaction === true ? 'Remove like' : 'Like this article'}
                >
                    {userReaction === true ? (
                        <HandThumbUpSolidIcon className="w-5 h-5" />
                    ) : (
                        <HandThumbUpIcon className="w-5 h-5" />
                    )}
                    <span className="font-medium">{likes}</span>
                </button>

                {/* Dislike Button */}
                <button
                    onClick={() => handleReaction(false)}
                    disabled={loading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-retro border-2 transition-all duration-200 font-retro-sans text-sm uppercase tracking-wide ${
                        userReaction === false
                            ? 'bg-retro-rust text-walnut-50 border-retro-rust shadow-retro'
                            : 'bg-walnut-50 text-walnut-700 border-walnut-400 hover:bg-walnut-100 hover:border-walnut-500'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={userReaction === false ? 'Remove dislike' : 'Dislike this article'}
                >
                    {userReaction === false ? (
                        <HandThumbDownSolidIcon className="w-5 h-5" />
                    ) : (
                        <HandThumbDownIcon className="w-5 h-5" />
                    )}
                    <span className="font-medium">{dislikes}</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="px-3 py-2 bg-retro-rust/10 border border-retro-rust/20 rounded-retro">
                    <p className="text-sm text-retro-rust font-retro-sans">{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center space-x-2 text-sm text-walnut-600 font-retro-sans">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-walnut-500 border-t-transparent"></div>
                    <span>Updating...</span>
                </div>
            )}
        </div>
    );
}
