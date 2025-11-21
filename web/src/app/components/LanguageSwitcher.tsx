"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition, type CSSProperties } from 'react';

const locales = [
    { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
    { code: 'ru', label: 'RU', flag: '🇷🇺', name: 'Русский' },
    { code: 'kk', label: 'KK', flag: '🇰🇿', name: 'Қазақ' }
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const currentLocale = locales.find(l => l.code === locale) || locales[0];

    function onSelectChange(newLocale: string) {
        startTransition(() => {
            // Remove current locale from pathname if it exists
            const pathnameWithoutLocale = pathname.replace(/^\/(en|ru|kk)/, '') || '/';

            // Add new locale to pathname (unless it's default 'en')
            const newPathname = newLocale === 'en'
                ? pathnameWithoutLocale
                : `/${newLocale}${pathnameWithoutLocale}`;

            router.replace(newPathname);
            setIsOpen(false);
        });
    }

    return (
        <div style={containerStyle}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={buttonStyle}
                disabled={isPending}
            >
                <span style={{ fontSize: 16 }}>{currentLocale.flag}</span>
                <span>{currentLocale.label}</span>
                <span style={{ fontSize: 12 }}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div style={dropdownStyle}>
                    {locales.map((loc) => (
                        <button
                            key={loc.code}
                            onClick={() => onSelectChange(loc.code)}
                            style={{
                                ...dropdownItemStyle,
                                background: loc.code === locale ? '#EFF6FF' : 'transparent',
                                color: loc.code === locale ? '#0066FF' : '#6B7280'
                            }}
                        >
                            <span style={{ fontSize: 16 }}>{loc.flag}</span>
                            <span>{loc.name}</span>
                            {loc.code === locale && <span style={{ marginLeft: 'auto', color: '#0066FF' }}>✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

const containerStyle: CSSProperties = {
    position: 'relative'
};

const buttonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    color: '#0066FF',
    transition: 'all 0.3s ease',
    fontFamily: 'Inter, system-ui, sans-serif'
};

const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
    minWidth: 180,
    zIndex: 1000,
    overflow: 'hidden'
};

const dropdownItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    width: '100%',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, system-ui, sans-serif'
};
