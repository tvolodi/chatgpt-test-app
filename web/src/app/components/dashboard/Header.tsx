"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import type { CSSProperties } from "react";

export function DashboardHeader() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <header style={headerStyle}>
            <div style={containerStyle}>
                {/* Logo - Clickable to return home */}
                <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                    <Image src="/AI-Dala-logo.png" alt="AI-Dala" width={40} height={40} priority />
                    <span style={logoTextStyle}>AI-Dala</span>
                </a>

                {/* User Menu */}
                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={userButtonStyle}
                    >
                        <div style={avatarStyle}>
                            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 600 }}>
                            {session?.user?.name || "User"}
                        </span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div style={dropdownStyle}>
                            <button onClick={handleLogout} style={menuItemStyle}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

const headerStyle: CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#FFFFFF",
    borderBottom: "1px solid #E5E7EB",
    height: "64px",
    display: "flex",
    alignItems: "center"
};

const containerStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const logoTextStyle: CSSProperties = {
    fontSize: "18px",
    fontWeight: 700,
    color: "#2B2B2B",
    fontFamily: "Inter, system-ui, sans-serif"
};

const userButtonStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 16px",
    background: "none",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#2B2B2B",
    transition: "all 0.3s ease"
};

const avatarStyle: CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3A9BDC 0%, #2B7FB8 100%)",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 700
};

const dropdownStyle: CSSProperties = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    minWidth: 160,
    overflow: "hidden"
};

const menuItemStyle: CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: 600,
    color: "#2B2B2B",
    transition: "background 0.2s ease"
};
