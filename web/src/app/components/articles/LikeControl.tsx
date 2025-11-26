"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface LikeControlProps {
    articleId: string;
    initialLikes: number;
    initialDislikes: number;
}

export default function LikeControl({ articleId, initialLikes, initialDislikes }: LikeControlProps) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userLike, setUserLike] = useState<boolean | null>(null); // true = like, false = dislike, null = none
    const [loading, setLoading] = useState(false);

    // Fetch user interaction status on mount if logged in
    useEffect(() => {
        if (session) {
            // TODO: Implement fetching user status if API supports it
        }
    }, [session, articleId]);

    // Sync state with props
    useEffect(() => {
        setLikes(initialLikes);
        setDislikes(initialDislikes);
    }, [initialLikes, initialDislikes]);

    const handleInteraction = async (isLike: boolean) => {
        if (!session) {
            alert("Please sign in to interact.");
            return;
        }
        if (loading) return;

        setLoading(true);
        // Optimistic update
        const previousUserLike = userLike;
        const previousLikes = likes;
        const previousDislikes = dislikes;

        if (userLike === isLike) {
            // Toggle off (remove)
            setUserLike(null);
            if (isLike) setLikes(l => l - 1);
            else setDislikes(d => d - 1);

            try {
                const res = await fetch(`/api/articles/${articleId}/like`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${session.accessToken}` } // Assuming accessToken is available
                });
                if (!res.ok) throw new Error();
            } catch (err) {
                // Revert
                setUserLike(previousUserLike);
                setLikes(previousLikes);
                setDislikes(previousDislikes);
            }
        } else {
            // New interaction or switch
            setUserLike(isLike);
            if (isLike) {
                setLikes(l => l + 1);
                if (previousUserLike === false) setDislikes(d => d - 1);
            } else {
                setDislikes(d => d + 1);
                if (previousUserLike === true) setLikes(l => l - 1);
            }

            try {
                const res = await fetch(`/api/articles/${articleId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.accessToken}`
                    },
                    body: JSON.stringify({ is_like: isLike })
                });
                if (!res.ok) throw new Error();
            } catch (err) {
                // Revert
                setUserLike(previousUserLike);
                setLikes(previousLikes);
                setDislikes(previousDislikes);
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={() => handleInteraction(true)}
                disabled={loading}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${userLike === true ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
                    }`}
            >
                <span>👍</span>
                <span>{likes}</span>
            </button>
            <button
                onClick={() => handleInteraction(false)}
                disabled={loading}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${userLike === false ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'
                    }`}
            >
                <span>👎</span>
                <span>{dislikes}</span>
            </button>
        </div>
    );
}
