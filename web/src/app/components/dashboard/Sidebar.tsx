"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

export function DashboardSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    // Load sidebar state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sidebarCollapsed");
        if (saved !== null) {
            setCollapsed(JSON.parse(saved));
        }
    }, []);

    // Save sidebar state to localStorage
    const toggleSidebar = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    };

    const navItems = [
        { href: "/dashboard", label: "Home", icon: "🏠" },
        { href: "/dashboard/news", label: "News", icon: "📰" },
        { href: "/dashboard/articles", label: "Articles", icon: "📝" },
        { href: "/dashboard/settings", label: "Settings", icon: "⚙️" }
    ];

    return (
        <aside style={{ ...sidebarStyle, width: collapsed ? 72 : 240 }}>
            {/* Toggle Button */}
            <button onClick={toggleSidebar} style={toggleButtonStyle}>
                {collapsed ? "→" : "←"}
            </button>

            {/* Navigation */}
            <nav style={navStyle}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                ...navItemStyle,
                                background: isActive ? "#E8F4F8" : "transparent",
                                color: isActive ? "#3A9BDC" : "#2B2B2B",
                                fontWeight: isActive ? 700 : 600
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

const sidebarStyle: CSSProperties = {
    height: "calc(100vh - 64px)",
    background: "#F7F9FC",
    borderRight: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    padding: "16px 0",
    transition: "width 0.3s ease",
    position: "sticky",
    top: 64
};

const toggleButtonStyle: CSSProperties = {
    alignSelf: "flex-end",
    margin: "0 16px 16px",
    padding: "8px 12px",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 700,
    color: "#3A9BDC",
    transition: "all 0.3s ease"
};

const navStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "0 16px"
};

const navItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: "14px",
    transition: "all 0.3s ease",
    fontFamily: "Inter, system-ui, sans-serif"
};
