"use client";

import { useSession, signOut } from "next-auth/react";
import type { CSSProperties } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "#2B2B2B",
    fontWeight: 600,
    fontSize: "14px",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    display: "inline-block"
};

const buttonStyle: CSSProperties = {
    ...navLinkStyle,
    background: "none",
    border: "none",
    fontFamily: "inherit",
    margin: 0,
    lineHeight: "inherit"
};

export function Navigation() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <nav aria-label="Primary">
            <ul style={{ display: "flex", gap: 16, listStyle: "none", margin: 0, padding: 0, alignItems: "center" }}>
                <li>
                    <a href="#about" style={navLinkStyle}>
                        About
                    </a>
                </li>
                <li>
                    <a href="#news" style={navLinkStyle}>
                        News
                    </a>
                </li>
                <li>
                    <a href="#articles" style={navLinkStyle}>
                        Articles
                    </a>
                </li>
                <li>
                    <a href="#contact" style={navLinkStyle}>
                        Contact / Subscribe
                    </a>
                </li>
                <li>
                    {isLoading ? (
                        <span style={{ ...navLinkStyle, opacity: 0.5 }}>...</span>
                    ) : session ? (
                        <>
                            <a href="/dashboard" style={navLinkStyle}>
                                Dashboard
                            </a>
                            <button
                                onClick={handleLogout}
                                style={buttonStyle}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <a href="/login" style={navLinkStyle}>
                            Sign in
                        </a>
                    )}
                </li>
                <li>
                    <LanguageSwitcher />
                </li>
            </ul>
        </nav>
    );
}
