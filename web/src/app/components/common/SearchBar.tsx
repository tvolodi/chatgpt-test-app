'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
    className?: string;
    placeholder?: string;
    showSuggestions?: boolean;
}

export function SearchBar({ className = '', placeholder, showSuggestions = false }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('search');
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    // Initialize query from URL params
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setQuery(q);
        }
    }, [searchParams]);

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (query.length >= 2) {
                // For now, just navigate to search page
                router.push(`/search?q=${encodeURIComponent(query)}`);
            }
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length >= 2) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleBlur = () => {
        // Delay closing to allow clicking suggestions
        setTimeout(() => setIsOpen(false), 200);
    };

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder || t('placeholder')}
                        className="w-full pl-10 pr-4 py-2 border-2 border-walnut-300 rounded-retro shadow-sm focus:ring-walnut-500 focus:border-walnut-500 bg-walnut-50 font-retro-sans text-walnut-700 placeholder-walnut-400"
                        minLength={2}
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-walnut-400" />
                </div>
            </form>

            {/* Suggestions dropdown - placeholder for future implementation */}
            {showSuggestions && isOpen && query.length >= 2 && (
                <div className="absolute z-10 mt-1 w-full bg-walnut-50 border-2 border-walnut-300 rounded-retro shadow-retro max-h-60 overflow-auto">
                    <div className="px-4 py-2 text-walnut-500 text-sm font-retro-sans">
                        {t('suggestionsComingSoon')}
                    </div>
                </div>
            )}
        </div>
    );
}