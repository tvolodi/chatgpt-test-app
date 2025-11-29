"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Image from "next/image";

interface UserActivity {
    likes: Array<{
        article_id: string;
        article_title: string;
        is_like: boolean;
        created_at: string;
    }>;
    comments: Array<{
        id: string;
        article_id: string;
        article_title: string;
        body: string;
        created_at: string;
    }>;
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const t = useTranslations('Profile');
    const [activity, setActivity] = useState<UserActivity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch('/api/user/activity');
                if (response.ok) {
                    const data = await response.json();
                    setActivity(data);
                } else {
                    setError('Failed to load activity');
                }
            } catch (err) {
                setError('Failed to load activity');
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchActivity();
        } else {
            setLoading(false);
        }
    }, [session]);

    if (!session) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-8 text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-retro text-walnut-800 mb-2">Access Denied</h2>
                    <p className="text-walnut-600">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    const user = session.user;
    const claims = session.user as any; // OIDC claims

    // Avatar fallback logic
    const getAvatarUrl = () => {
        if (claims?.picture) return claims.picture;
        if (claims?.email) {
            // Gravatar fallback using crypto-js MD5
            const email = claims.email.toLowerCase().trim();
            const hash = require('crypto-js/md5')(email).toString();
            return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`;
        }
        return '/default-avatar.png'; // Default avatar
    };

    // Role display mapping
    const getRoleDisplayName = (role: string) => {
        const roleMap: Record<string, string> = {
            'content-manager': 'Content Manager',
            'admin': 'Administrator',
            'user': 'User',
            'editor': 'Editor'
        };
        return roleMap[role] || role;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="text-center">
                <h1 className="text-4xl font-retro text-walnut-800 mb-2">Profile</h1>
                <p className="text-lg text-walnut-600">Manage your account information and view your activity</p>
            </div>

            {/* Profile Card */}
            <div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-retro border-4 border-walnut-500 overflow-hidden shadow-retro">
                            <Image
                                src={getAvatarUrl()}
                                alt="Profile Avatar"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to default avatar on error
                                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                                }}
                            />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-retro text-walnut-800 mb-2">
                            {claims?.preferred_username || claims?.name || user?.name || 'User'}
                        </h2>
                        <p className="text-xl text-walnut-600 mb-4">{claims?.email || user?.email}</p>

                        {/* Roles */}
                        {claims?.realm_access?.roles && (
                            <div className="mb-6">
                                <h3 className="text-sm font-retro-sans uppercase tracking-wide text-walnut-700 mb-2">Roles</h3>
                                <div className="flex flex-wrap gap-2">
                                    {claims.realm_access.roles.map((role: string) => (
                                        <span
                                            key={role}
                                            className="px-3 py-1 bg-walnut-200 text-walnut-700 border border-walnut-400 rounded-retro text-sm font-retro-sans uppercase"
                                        >
                                            {getRoleDisplayName(role)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Keycloak Link */}
                        <div className="mb-6">
                            <a
                                href={`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/account`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-walnut-600 text-walnut-50 rounded-retro border-2 border-walnut-700 shadow-retro hover:shadow-retro-hover transition-all duration-200 font-retro-sans uppercase text-sm tracking-wide"
                            >
                                ✦ Edit in Keycloak →
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-8">
                <h3 className="text-2xl font-retro text-walnut-800 mb-6">Recent Activity</h3>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">⏳</div>
                        <p className="text-walnut-600">Loading your activity...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-walnut-600">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Likes */}
                        {activity?.likes && activity.likes.length > 0 && (
                            <div>
                                <h4 className="text-lg font-retro text-walnut-700 mb-3 flex items-center gap-2">
                                    👍 Liked Articles
                                </h4>
                                <div className="space-y-2">
                                    {activity.likes.map((like) => (
                                        <div key={like.article_id} className="flex items-center justify-between p-3 bg-walnut-100 rounded-retro border border-walnut-300">
                                            <span className="text-walnut-800">{like.article_title}</span>
                                            <span className="text-sm text-walnut-600">{formatDate(like.created_at)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comments */}
                        {activity?.comments && activity.comments.length > 0 && (
                            <div>
                                <h4 className="text-lg font-retro text-walnut-700 mb-3 flex items-center gap-2">
                                    💬 Comments
                                </h4>
                                <div className="space-y-2">
                                    {activity.comments.map((comment) => (
                                        <div key={comment.id} className="p-3 bg-walnut-100 rounded-retro border border-walnut-300">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-walnut-800 font-medium">{comment.article_title}</span>
                                                <span className="text-sm text-walnut-600">{formatDate(comment.created_at)}</span>
                                            </div>
                                            <p className="text-walnut-700 text-sm">{comment.body}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Activity */}
                        {(!activity?.likes?.length && !activity?.comments?.length) && (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">📝</div>
                                <p className="text-walnut-600">No recent activity to display.</p>
                                <p className="text-sm text-walnut-500 mt-2">Start engaging with articles to see your activity here!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}