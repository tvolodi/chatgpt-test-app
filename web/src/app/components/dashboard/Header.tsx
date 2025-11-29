"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export function DashboardHeader() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <header className="sticky top-0 z-50 bg-retro-cream border-b-2 border-walnut-500 h-16 flex items-center">
            <div className="w-full px-6 flex justify-between items-center">
                {/* Logo - Clickable to return home */}
                <a href="/" className="flex items-center gap-3 no-underline">
                    <Image src="/AI-Dala-logo.png" alt="AI-Dala" width={40} height={40} priority />
                    <span className="text-lg font-bold text-walnut-800 font-retro">AI-Dala</span>
                </a>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-3 px-4 py-2 bg-transparent border-2 border-walnut-400 rounded-retro cursor-pointer text-walnut-800 hover:bg-walnut-100 transition-all font-retro-sans"
                    >
                        <div className="w-8 h-8 rounded-full bg-walnut-600 text-walnut-50 flex items-center justify-center text-sm font-bold">
                            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-semibold">
                            {session?.user?.name || "User"}
                        </span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute top-[calc(100%+8px)] right-0 bg-walnut-50 border-2 border-walnut-500 rounded-retro shadow-retro min-w-[160px] overflow-hidden">
                            <button 
                                onClick={handleLogout} 
                                className="w-full px-4 py-3 bg-transparent border-none text-left cursor-pointer font-retro-sans text-sm font-semibold text-walnut-700 hover:bg-walnut-100 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
