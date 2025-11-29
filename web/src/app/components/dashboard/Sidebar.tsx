"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useNavigationGuard } from "../../context/NavigationGuardContext";

export function DashboardSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { confirmNavigation } = useNavigationGuard();

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
        { href: "/dashboard/categories", label: "Categories", icon: "📁" },
        { href: "/dashboard/tags", label: "Tags", icon: "🏷️" },
        { href: "/dashboard/settings", label: "Settings", icon: "⚙️" }
    ];

    const handleNavigation = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        confirmNavigation(() => {
            router.push(href);
        });
    };

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
                            onClick={(e) => handleNavigation(e, item.href)}
                            style={{
                                ...navItemStyle,
                                background: isActive ? "#0066FF" : "transparent",
                                color: isActive ? "#FFFFFF" : "#6d5a3a",
                                fontWeight: isActive ? 700 : 600,
                                boxShadow: isActive ? "3px 3px 0px 0px rgba(0, 102, 255, 0.3)" : "none",
                                border: isActive ? "2px solid #0047B3" : "2px solid transparent"
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{item.icon}</span>
                            {!collapsed && <span style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "12px" }}>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

const sidebarStyle: CSSProperties = {
    height: "calc(100vh - 64px)",
    background: "#f5f0e8",  // walnut-100
    borderRight: "2px solid #8b6914",  // walnut-500
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
    background: "#faf8f5",  // walnut-50
    border: "2px solid #8b6914",  // walnut-500
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 700,
    color: "#8b6914",  // walnut-500
    transition: "all 0.3s ease",
    boxShadow: "2px 2px 0px 0px rgba(139, 105, 20, 0.3)"
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
    borderRadius: "2px",
    textDecoration: "none",
    fontSize: "14px",
    transition: "all 0.3s ease",
    fontFamily: '"Source Sans Pro", "Helvetica Neue", sans-serif'
};
