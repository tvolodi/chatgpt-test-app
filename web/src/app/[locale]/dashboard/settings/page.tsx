"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

type SupportedLocale = 'en' | 'ru' | 'kk';

const LOCALE_NAMES: Record<SupportedLocale, string> = {
    en: 'English',
    ru: 'Русский',
    kk: 'Қазақша'
};

export default function SettingsPage() {
    const t = useTranslations('Settings');
    const router = useRouter();
    const pathname = usePathname();
    const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>('en');
    const [saving, setSaving] = useState(false);

    // Load current locale from localStorage or pathname
    useEffect(() => {
        const saved = localStorage.getItem('user_locale') as SupportedLocale;
        if (saved && Object.keys(LOCALE_NAMES).includes(saved)) {
            setSelectedLocale(saved);
        } else {
            // Extract locale from pathname
            const pathLocale = pathname.split('/')[1] as SupportedLocale;
            if (pathLocale && Object.keys(LOCALE_NAMES).includes(pathLocale)) {
                setSelectedLocale(pathLocale);
            }
        }
    }, [pathname]);

    const handleLocaleChange = async (newLocale: SupportedLocale) => {
        setSaving(true);

        try {
            // Save to localStorage
            localStorage.setItem('user_locale', newLocale);
            localStorage.setItem('user_preferences', JSON.stringify({
                locale: newLocale,
                // Add other preferences here as they are implemented
            }));

            // Update the URL to reflect the new locale
            const newPathname = pathname.replace(/^\/[^\/]+/, `/${newLocale}`);
            router.push(newPathname);

            setSelectedLocale(newLocale);
        } catch (error) {
            console.error('Failed to save locale preference:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="text-center">
                <h1 className="text-4xl font-retro text-walnut-800 mb-2">Settings</h1>
                <p className="text-lg text-walnut-600">Manage your account preferences and settings</p>
            </div>

            {/* Language Settings */}
            <div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-8">
                <h2 className="text-2xl font-retro text-walnut-800 mb-6 flex items-center gap-3">
                    🌐 Language Preferences
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-retro-sans uppercase tracking-wide text-walnut-700 mb-3">
                            Interface Language
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(Object.keys(LOCALE_NAMES) as SupportedLocale[]).map((locale) => (
                                <button
                                    key={locale}
                                    onClick={() => handleLocaleChange(locale)}
                                    disabled={saving}
                                    className={`p-4 rounded-retro border-2 transition-all duration-200 text-left ${
                                        selectedLocale === locale
                                            ? 'bg-walnut-600 text-walnut-50 border-walnut-700 shadow-retro'
                                            : 'bg-walnut-100 text-walnut-700 border-walnut-300 hover:bg-walnut-200 hover:border-walnut-400'
                                    } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <div className="font-retro text-lg mb-1">
                                        {LOCALE_NAMES[locale]}
                                    </div>
                                    <div className="text-sm opacity-80 uppercase tracking-wide">
                                        {locale}
                                    </div>
                                    {selectedLocale === locale && (
                                        <div className="mt-2 text-sm">
                                            ✓ Currently selected
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {saving && (
                        <div className="flex items-center gap-2 text-walnut-600">
                            <div className="animate-spin text-lg">⏳</div>
                            <span>Saving your preferences...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Future Settings Placeholder */}
            <div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-8">
                <h2 className="text-2xl font-retro text-walnut-800 mb-6 flex items-center gap-3">
                    🔮 Coming Soon
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-walnut-100 rounded-retro border border-walnut-300">
                        <h3 className="font-retro text-walnut-800 mb-2">🔔 Notifications</h3>
                        <p className="text-sm text-walnut-600">Configure how and when you receive notifications about new content and updates.</p>
                    </div>

                    <div className="p-4 bg-walnut-100 rounded-retro border border-walnut-300">
                        <h3 className="font-retro text-walnut-800 mb-2">🎨 Appearance</h3>
                        <p className="text-sm text-walnut-600">Customize the look and feel of your dashboard with themes and layouts.</p>
                    </div>

                    <div className="p-4 bg-walnut-100 rounded-retro border border-walnut-300">
                        <h3 className="font-retro text-walnut-800 mb-2">🔒 Privacy</h3>
                        <p className="text-sm text-walnut-600">Control your privacy settings and data sharing preferences.</p>
                    </div>

                    <div className="p-4 bg-walnut-100 rounded-retro border border-walnut-300">
                        <h3 className="font-retro text-walnut-800 mb-2">📊 Analytics</h3>
                        <p className="text-sm text-walnut-600">View your reading statistics and content engagement metrics.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
