import type { CSSProperties } from "react";

export function DashboardFooter() {
    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                {/* Copyright */}
                <div style={copyrightStyle}>
                    © 2025 AI-Dala. All rights reserved.
                </div>

                {/* Links */}
                <div style={linksStyle}>
                    <a href="/about" style={linkStyle}>About</a>
                    <span style={separatorStyle}>•</span>
                    <a href="/privacy" style={linkStyle}>Privacy Policy</a>
                    <span style={separatorStyle}>•</span>
                    <a href="/terms" style={linkStyle}>Terms of Service</a>
                </div>

                {/* Tagline */}
                <div style={taglineStyle}>
                    "Where Ideas Meet the Steppe — and Grow with AI"
                </div>
            </div>
        </footer>
    );
}

const footerStyle: CSSProperties = {
    background: "#2B2B2B",
    color: "#FFFFFF",
    padding: "12px 24px",
    borderTop: "1px solid #404040",
    marginTop: "auto"
};

const containerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    fontSize: "13px",
    fontFamily: "Inter, system-ui, sans-serif"
};

const copyrightStyle: CSSProperties = {
    fontWeight: 400
};

const linksStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12
};

const linkStyle: CSSProperties = {
    color: "#FFFFFF",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.3s ease"
};

const separatorStyle: CSSProperties = {
    color: "#9CA3AF"
};

const taglineStyle: CSSProperties = {
    fontStyle: "italic",
    color: "#E6C68E",
    fontWeight: 400
};
