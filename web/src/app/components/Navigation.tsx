"use client";

import { useSession, signOut } from "next-auth/react";
import type { CSSProperties } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from 'next-intl';

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
    const t = useTranslations('navigation');
    const tCommon = useTranslations('common');

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <nav aria-label="Primary">
            <ul style={{ display: "flex", gap: 16, listStyle: "none", margin: 0, padding: 0, alignItems: "center" }}>
                <li>
                    <a href="#about" style={navLinkStyle}>
                        {t('about')}
                    </a>
                </li>
                <li>
                    <a href="#news" style={navLinkStyle}>
                        {t('news')}
                    </a>
                </li>
                <li>
                    <a href="#articles" style={navLinkStyle}>
                        {t('articles')}
                    </a>
                </li>
                <li>
                    <a href="#contact" style={navLinkStyle}>
                        {t('contact')}
                    </a>
                </li>
                <li>
                    {isLoading ? (
                        <span style={{ ...navLinkStyle, opacity: 0.5 }}>...</span>
                    ) : session ? (
                        <>
                            <a href="/dashboard" style={navLinkStyle}>
                                {tCommon('dashboard')}
                            </a>
                            <button
                                onClick={handleLogout}
                                style={buttonStyle}
                            >
                                {tCommon('logout')}
                            </button>
                        </>
                    ) : (
                        <a href="/login" style={navLinkStyle}>
                            {tCommon('signIn')}
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
