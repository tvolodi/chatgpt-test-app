"use client";

import type { CSSProperties } from "react";

export default function SettingsPage() {
    return (
        <div style={containerStyle}>
            {/* Page Header */}
            <div style={headerStyle}>
                <h1 style={headingStyle}>Settings</h1>
                <p style={subtitleStyle}>Manage your account and preferences</p>
            </div>

            {/* Empty State */}
            <div style={emptyStateStyle}>
                <div style={iconStyle}>⚙️</div>
                <h2 style={emptyHeadingStyle}>Settings</h2>
                <p style={emptyTextStyle}>
                    User settings and preferences will be added in a future update.
                </p>
                <div style={infoBoxStyle}>
                    <p style={{ margin: 0, fontSize: "14px" }}>
                        <strong>Coming Soon:</strong> Manage your profile, preferences, and account settings.
                    </p>
                </div>
            </div>
        </div>
    );
}

const containerStyle: CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto"
};

const headerStyle: CSSProperties = {
    marginBottom: 32
};

const headingStyle: CSSProperties = {
    fontSize: "32px",
    fontWeight: 700,
    color: "#0A1929",
    margin: "0 0 8px"
};

const subtitleStyle: CSSProperties = {
    fontSize: "16px",
    color: "#6B7280",
    margin: 0
};

const emptyStateStyle: CSSProperties = {
    background: "#FFFFFF",
    borderRadius: 16,
    padding: "64px 40px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    textAlign: "center"
};

const iconStyle: CSSProperties = {
    fontSize: 64,
    marginBottom: 24
};

const emptyHeadingStyle: CSSProperties = {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0A1929",
    margin: "0 0 12px"
};

const emptyTextStyle: CSSProperties = {
    fontSize: "16px",
    color: "#6B7280",
    margin: "0 0 24px",
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto"
};

const infoBoxStyle: CSSProperties = {
    background: "#EFF6FF",
    border: "1px solid #0066FF",
    borderRadius: 12,
    padding: "16px 20px",
    color: "#0A1929",
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto"
};
